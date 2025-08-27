import { useEffect, useState, useCallback } from 'react';
import { ArrowLeftRight, ExternalLink } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { QUICKSTART_GUIDE_URL } from '../../providers/modal/constants';
import { Input } from '../../../ui/input';
import { Select } from '../../../ui/Select';
import { useConfig } from '../../../ConfigContext';
import { useModelAndProvider } from '../../../ModelAndProviderContext';
import type { View } from '../../../../utils/navigationUtils';
import Model, { getProviderMetadata } from '../modelInterface';
import { getPredefinedModelsFromEnv, shouldShowPredefinedModels } from '../predefinedModelsUtils';

type AddModelModalProps = {
  onClose: () => void;
  setView: (view: View) => void;
};
export const AddModelModal = ({ onClose, setView }: AddModelModalProps) => {
  const { getProviders, getProviderModels, read } = useConfig();
  const { changeModel } = useModelAndProvider();
  const [providerOptions, setProviderOptions] = useState<{ value: string; label: string }[]>([]);
  type ModelOption = { value: string; label: string; provider: string; isDisabled?: boolean };
  const [modelOptions, setModelOptions] = useState<{ options: ModelOption[] }[]>([]);
  const [provider, setProvider] = useState<string | null>(null);
  const [model, setModel] = useState<string>('');
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    provider: '',
    model: '',
  });
  const [isValid, setIsValid] = useState(true);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [usePredefinedModels] = useState(shouldShowPredefinedModels());
  const [selectedPredefinedModel, setSelectedPredefinedModel] = useState<Model | null>(null);
  const [predefinedModels, setPredefinedModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState<boolean>(false);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors = {
      provider: '',
      model: '',
    };
    let formIsValid = true;

    if (usePredefinedModels) {
      if (!selectedPredefinedModel) {
        errors.model = 'Please select a model';
        formIsValid = false;
      }
    } else {
      if (!provider) {
        errors.provider = 'Please select a provider';
        formIsValid = false;
      }

      if (!model) {
        errors.model = 'Please select or enter a model';
        formIsValid = false;
      }
    }

    setValidationErrors(errors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [model, provider, usePredefinedModels, selectedPredefinedModel]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setAttemptedSubmit(true);
    const isFormValid = validateForm();

    if (isFormValid) {
      let modelObj: Model;

      if (usePredefinedModels && selectedPredefinedModel) {
        modelObj = selectedPredefinedModel;
      } else {
        const providerMetaData = await getProviderMetadata(provider || '', getProviders);
        const providerDisplayName = providerMetaData.display_name;
        modelObj = { name: model, provider: provider, subtext: providerDisplayName } as Model;
      }

      await changeModel(modelObj);
      onClose();
    }
  };

  // Re-validate when inputs change and after attempted submission
  useEffect(() => {
    if (attemptedSubmit) {
      validateForm();
    }
  }, [attemptedSubmit, validateForm]);

  useEffect(() => {
    // Load predefined models if enabled
    if (usePredefinedModels) {
      const models = getPredefinedModelsFromEnv();
      setPredefinedModels(models);

      // Initialize selected predefined model with current model
      (async () => {
        try {
          const currentModelName = (await read('GOOSE_MODEL', false)) as string;
          const matchingModel = models.find((model) => model.name === currentModelName);
          if (matchingModel) {
            setSelectedPredefinedModel(matchingModel);
          }
        } catch (error) {
          console.error('Failed to get current model for selection:', error);
        }
      })();
    }

    // Load providers for manual model selection
    (async () => {
      try {
        const providersResponse = await getProviders(false);
        const activeProviders = providersResponse.filter((provider) => provider.is_configured);
        // Create provider options and add "Use other provider" option
        setProviderOptions([
          ...activeProviders.map(({ metadata, name }) => ({
            value: name,
            label: metadata.display_name,
          })),
          {
            value: 'configure_providers',
            label: 'Use other provider',
          },
        ]);

        setLoadingModels(true);

        // Fetching models for all providers
        const modelPromises = activeProviders.map(async (p) => {
          const providerName = p.name;
          try {
            let models = await getProviderModels(providerName);
            // Fallback to known_models if server returned none
            if ((!models || models.length === 0) && p.metadata.known_models?.length) {
              models = p.metadata.known_models.map((m) => m.name);
            }
            return { provider: p, models, error: null };
          } catch (e: unknown) {
            return {
              provider: p,
              models: null,
              error: `Failed to fetch models for ${providerName}${e instanceof Error ? `: ${e.message}` : ''}`,
            };
          }
        });
        const results = await Promise.all(modelPromises);

        // Process results and build grouped options
        const groupedOptions: { options: { value: string; label: string; provider: string }[] }[] =
          [];
        const errors: string[] = [];

        results.forEach(({ provider: p, models, error }) => {
          if (error) {
            errors.push(error);
            // Fallback to metadata known_models on error
            if (p.metadata.known_models && p.metadata.known_models.length > 0) {
              groupedOptions.push({
                options: p.metadata.known_models.map(({ name }) => ({
                  value: name,
                  label: name,
                  provider: p.name,
                })),
              });
            }
          } else if (models && models.length > 0) {
            groupedOptions.push({
              options: models.map((m) => ({ value: m, label: m, provider: p.name })),
            });
          }
        });

        // Log errors if any providers failed (don't show to user)
        if (errors.length > 0) {
          console.error('Provider model fetch errors:', errors);
        }

        // Add the "Custom model" option to each provider group
        groupedOptions.forEach((group) => {
          const providerName = group.options[0]?.provider;
          if (providerName && !providerName.startsWith('custom_')) {
            group.options.push({
              value: 'custom',
              label: 'Use custom model',
              provider: providerName,
            });
          }
        });

        setModelOptions(groupedOptions);
        setOriginalModelOptions(groupedOptions);
      } catch (error: unknown) {
        console.error('Failed to query providers:', error);
      } finally {
        setLoadingModels(false);
      }
    })();
  }, [getProviders, getProviderModels, usePredefinedModels, read]);

  // Filter model options based on selected provider
  const filteredModelOptions = provider
    ? modelOptions.filter((group) => group.options[0]?.provider === provider)
    : [];

  // Handle model selection change
  const handleModelChange = (newValue: unknown) => {
    const selectedOption = newValue as { value: string; label: string; provider: string } | null;
    if (selectedOption?.value === 'custom') {
      setIsCustomModel(true);
      setModel('');
    } else {
      setIsCustomModel(false);
      setModel(selectedOption?.value || '');
    }
  };

  // Store the original model options in state, initialized from modelOptions
  const [originalModelOptions, setOriginalModelOptions] =
    useState<{ options: { value: string; label: string; provider: string }[] }[]>(modelOptions);

  const handleInputChange = (inputValue: string) => {
    if (!provider) return;

    const trimmedInput = inputValue.trim();

    if (trimmedInput === '') {
      // Reset to original model options when input is cleared
      setModelOptions([...originalModelOptions]); // Create new array to ensure state update
      return;
    }

    // Filter through the original model options to find matches
    const matchingOptions = originalModelOptions
      .map((group) => ({
        options: group.options.filter(
          (option) =>
            option.value.toLowerCase().includes(trimmedInput.toLowerCase()) &&
            option.value !== 'custom' // Exclude the "Use custom model" option from search
        ),
      }))
      .filter((group) => group.options.length > 0);

    if (matchingOptions.length > 0) {
      // If we found matches in the existing options, show those
      setModelOptions(matchingOptions);
    } else {
      // If no matches, show the "Use: " option
      const customOption = [
        {
          options: [
            {
              value: trimmedInput,
              label: `Use: "${trimmedInput}"`,
              provider: provider,
            },
          ],
        },
      ];
      setModelOptions(customOption);
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight size={24} className="text-textStandard" />
            Switch models
          </DialogTitle>
          <DialogDescription>
            Configure your AI model providers by adding their API keys. Your keys are stored
            securely and encrypted locally.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div>
            <a
              href={QUICKSTART_GUIDE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-textStandard font-medium text-sm"
            >
              <ExternalLink size={16} className="mr-1" />
              View quick start guide
            </a>
          </div>

          {usePredefinedModels ? (
            /* Predefined Models Section */
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-textStandard">Choose a model:</label>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {predefinedModels.map((model) => (
                  <div key={model.id || model.name} className="group hover:cursor-pointer text-sm">
                    <div
                      className={`flex items-center justify-between text-text-default py-2 px-2 ${
                        selectedPredefinedModel?.name === model.name
                          ? 'bg-background-muted'
                          : 'bg-background-default hover:bg-background-muted'
                      } rounded-lg transition-all`}
                      onClick={() => setSelectedPredefinedModel(model)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-text-default font-medium">
                            {model.alias || model.name}
                          </span>
                          {model.alias?.includes('recommended') && (
                            <span className="text-xs bg-background-muted text-textStandard px-2 py-1 rounded-full border border-borderSubtle ml-2">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-[2px]">
                          <span className="text-xs text-text-muted">{model.subtext}</span>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs text-text-muted">{model.provider}</span>
                        </div>
                      </div>

                      <div className="relative flex items-center ml-3">
                        <input
                          type="radio"
                          name="predefined-model"
                          value={model.name}
                          checked={selectedPredefinedModel?.name === model.name}
                          onChange={() => setSelectedPredefinedModel(model)}
                          className="peer sr-only"
                        />
                        <div
                          className="h-4 w-4 rounded-full border border-border-default 
                                peer-checked:border-[6px] peer-checked:border-black dark:peer-checked:border-white
                                peer-checked:bg-white dark:peer-checked:bg-black
                                transition-all duration-200 ease-in-out group-hover:border-border-default"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {attemptedSubmit && validationErrors.model && (
                <div className="text-red-500 text-sm mt-1">{validationErrors.model}</div>
              )}
            </div>
          ) : (
            /* Manual Provider/Model Selection */
            <div className="w-full flex flex-col gap-4">
              <div>
                <Select
                  options={providerOptions}
                  value={providerOptions.find((option) => option.value === provider) || null}
                  onChange={(newValue: unknown) => {
                    const option = newValue as { value: string; label: string } | null;
                    if (option?.value === 'configure_providers') {
                      // Navigate to ConfigureProviders view
                      setView('ConfigureProviders');
                      onClose(); // Close the current modal
                    } else {
                      setProvider(option?.value || null);
                      setModel('');
                      setIsCustomModel(false);
                    }
                  }}
                  placeholder="Provider, type to search"
                  isClearable
                />
                {attemptedSubmit && validationErrors.provider && (
                  <div className="text-red-500 text-sm mt-1">{validationErrors.provider}</div>
                )}
              </div>

              {provider && (
                <>
                  {!isCustomModel ? (
                    <div>
                      <Select
                        options={
                          loadingModels
                            ? [
                                {
                                  options: [
                                    {
                                      value: '__loading__',
                                      label: 'Loading models…',
                                      provider: provider || '',
                                      isDisabled: true,
                                    },
                                  ],
                                },
                              ]
                            : filteredModelOptions.length > 0
                              ? filteredModelOptions
                              : []
                        }
                        onChange={handleModelChange}
                        onInputChange={handleInputChange} // Added for input handling
                        value={model ? { value: model, label: model } : null}
                        placeholder="Select a model, type to search"
                      />

                      {attemptedSubmit && validationErrors.model && (
                        <div className="text-red-500 text-sm mt-1">{validationErrors.model}</div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <label className="text-sm text-textSubtle">Custom model name</label>
                        <button
                          onClick={() => setIsCustomModel(false)}
                          className="text-sm text-textSubtle"
                        >
                          Back to model list
                        </button>
                      </div>
                      <Input
                        className="border-2 px-4 py-5"
                        placeholder="Type model name here"
                        onChange={(event) => setModel(event.target.value)}
                        value={model}
                      />
                      {attemptedSubmit && validationErrors.model && (
                        <div className="text-red-500 text-sm mt-1">{validationErrors.model}</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Select model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
