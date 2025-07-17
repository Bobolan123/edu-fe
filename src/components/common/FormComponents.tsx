import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  InputAdornment,
  IconButton,
  Autocomplete,
  Chip,
  Box,
  Typography,
  Paper,
  Fade,
  Zoom,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Control, Controller, FieldPath, FieldError } from 'react-hook-form';

// Generic form field wrapper with consistent styling and validation
interface FormFieldProps<T extends Record<string, any>> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  error?: FieldError;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

// Enhanced Text Field with validation
interface TextFieldProps<T extends Record<string, any>> extends FormFieldProps<T> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  showPasswordToggle?: boolean;
  maxLength?: number;
}

export const FormTextField = <T extends Record<string, any>>({
  name,
  control,
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  type = 'text',
  placeholder,
  multiline = false,
  rows = 4,
  maxRows,
  startAdornment,
  endAdornment,
  showPasswordToggle = false,
  maxLength,
  className,
}: TextFieldProps<T>) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const theme = useTheme();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getInputType = () => {
    if (type === 'password' && showPasswordToggle) {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const getEndAdornment = () => {
    if (type === 'password' && showPasswordToggle) {
      return (
        <InputAdornment position="end">
          <IconButton 
            onClick={handleTogglePassword} 
            edge="end"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
          {endAdornment}
        </InputAdornment>
      );
    }
    return endAdornment;
  };

  return (
    <Box className={`relative ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Fade in timeout={300}>
            <TextField
              {...field}
              label={label}
              type={getInputType()}
              placeholder={placeholder}
              multiline={multiline}
              rows={multiline ? rows : undefined}
              maxRows={maxRows}
              required={required}
              disabled={disabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message || helperText}
              fullWidth
              variant="outlined"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              inputProps={{
                maxLength,
              }}
              InputProps={{
                startAdornment,
                endAdornment: getEndAdornment(),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: focused ? 'background.paper' : 'background.neutral',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                    '& fieldset': {
                      borderColor: 'primary.light',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    '& fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '&.Mui-error': {
                    '& fieldset': {
                      borderColor: 'error.main',
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.1)}`,
                    },
                  },
                  '& fieldset': {
                    borderWidth: '2px',
                    borderColor: 'divider',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                  '&.Mui-error': {
                    color: 'error.main',
                  },
                },
                '& .MuiFormHelperText-root': {
                  marginLeft: 1,
                  marginTop: 1,
                  fontSize: '0.75rem',
                  '&.Mui-error': {
                    color: 'error.main',
                  },
                },
              }}
            />
          </Fade>
        )}
      />
      
      {/* Character count indicator */}
      {maxLength && (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                right: 12,
                bottom: -20,
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              {field.value?.length || 0}/{maxLength}
            </Typography>
          )}
        />
      )}
    </Box>
  );
};

// Select Field with validation
interface SelectFieldProps<T extends Record<string, any>> extends FormFieldProps<T> {
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  placeholder?: string;
  multiple?: boolean;
}

export const FormSelectField = <T extends Record<string, any>>({
  name,
  control,
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  options,
  placeholder,
  multiple = false,
  className,
}: SelectFieldProps<T>) => {
  const [focused, setFocused] = React.useState(false);
  const theme = useTheme();

  return (
    <Box className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Fade in timeout={300}>
            <FormControl fullWidth error={!!fieldState.error}>
              <FormLabel 
                required={required}
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                  marginBottom: 1,
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                  '&.Mui-error': {
                    color: 'error.main',
                  },
                }}
              >
                {label}
              </FormLabel>
              <Select
                {...field}
                value={field.value ?? (multiple ? [] : '')}
                multiple={multiple}
                disabled={disabled}
                displayEmpty
                onOpen={() => setFocused(true)}
                onClose={() => setFocused(false)}
                renderValue={(selected: unknown) => {
                  if (multiple && Array.isArray(selected) && selected.length === 0) {
                    return <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>{placeholder}</Typography>;
                  }
                  if (!multiple && (selected === '' || selected === null || selected === undefined)) {
                    return <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>{placeholder}</Typography>;
                  }
                  if (multiple && Array.isArray(selected)) {
                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value, index) => {
                          const option = options.find(opt => opt.value === value);
                          return (
                            <Chip
                              key={`${value}-${index}`}
                              label={option?.label || String(value)}
                              size="small"
                              sx={{
                                height: '24px',
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                                '& .MuiChip-deleteIcon': {
                                  color: 'primary.main',
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    );
                  }
                  const option = options.find(opt => opt.value === selected);
                  return option?.label || String(selected);
                }}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: focused ? 'background.paper' : 'background.neutral',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  '&.Mui-error': {
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.1)}`,
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px',
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'error.main',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '12px',
                      marginTop: 1,
                      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                      '& .MuiMenuItem-root': {
                        borderRadius: '8px',
                        margin: '4px 8px',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {placeholder && (
                  <MenuItem value="" disabled>
                    <Typography color="text.secondary">{placeholder}</Typography>
                  </MenuItem>
                )}
                {options.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {(fieldState.error?.message || helperText) && (
                <FormHelperText 
                  sx={{ 
                    marginLeft: 1,
                    marginTop: 1,
                    fontSize: '0.75rem',
                  }}
                >
                  {fieldState.error?.message || helperText}
                </FormHelperText>
              )}
            </FormControl>
          </Fade>
        )}
      />
    </Box>
  );
};

// Autocomplete Field with validation
interface AutocompleteFieldProps<T extends Record<string, any>> extends FormFieldProps<T> {
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  multiple?: boolean;
  freeSolo?: boolean;
  loading?: boolean;
}

export const FormAutocompleteField = <T extends Record<string, any>>({
  name,
  control,
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  options,
  placeholder,
  multiple = false,
  freeSolo = false,
  loading = false,
  className,
}: AutocompleteFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            return option.label || '';
          }}
          isOptionEqualToValue={(option, value) => {
            if (typeof option === 'string' && typeof value === 'string') {
              return option === value;
            }
            return option.value === value?.value;
          }}
          multiple={multiple}
          freeSolo={freeSolo}
          disabled={disabled}
          loading={loading}
          onChange={(_, newValue) => {
            if (multiple) {
              field.onChange(newValue);
            } else {
              field.onChange(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              required={required}
              error={!!fieldState.error}
              helperText={fieldState.error?.message || helperText}
              variant="outlined"
              fullWidth
            />
          )}
          className={className}
        />
      )}
    />
  );
};

// Checkbox Field with validation
interface CheckboxFieldProps<T extends Record<string, any>> extends Omit<FormFieldProps<T>, 'label'> {
  label: React.ReactNode;
  color?: 'primary' | 'secondary' | 'default';
}

export const FormCheckboxField = <T extends Record<string, any>>({
  name,
  control,
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  color = 'primary',
  className,
}: CheckboxFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} className={className}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                color={color}
                disabled={disabled}
              />
            }
            label={label}
            required={required}
          />
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>{fieldState.error?.message || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

// Radio Group Field with validation
interface RadioFieldProps<T extends Record<string, any>> extends FormFieldProps<T> {
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  row?: boolean;
}

export const FormRadioField = <T extends Record<string, any>>({
  name,
  control,
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  options,
  row = false,
  className,
}: RadioFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <RadioGroup {...field} row={row}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio disabled={disabled || option.disabled} />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>{fieldState.error?.message || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

// Switch Field with validation
interface SwitchFieldProps<T extends Record<string, any>> extends Omit<FormFieldProps<T>, 'label'> {
  label: React.ReactNode;
  color?: 'primary' | 'secondary' | 'default';
}

export const FormSwitchField = <T extends Record<string, any>>({
  name,
  control,
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  color = 'primary',
  className,
}: SwitchFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} className={className}>
          <FormControlLabel
            control={
              <Switch
                {...field}
                checked={!!field.value}
                color={color}
                disabled={disabled}
              />
            }
            label={label}
            required={required}
          />
          {(fieldState.error?.message || helperText) && (
            <FormHelperText>{fieldState.error?.message || helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

// Form validation status indicator
interface ValidationStatusProps {
  error?: FieldError;
  success?: boolean;
  message?: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  error,
  success,
  message,
}) => {
  if (error) {
    return (
      <Box className="flex items-center gap-1 mt-1">
        <ErrorIcon fontSize="small" color="error" />
        <Typography variant="caption" color="error">
          {error.message}
        </Typography>
      </Box>
    );
  }

  if (success && message) {
    return (
      <Box className="flex items-center gap-1 mt-1">
        <CheckCircleIcon fontSize="small" color="success" />
        <Typography variant="caption" color="success.main">
          {message}
        </Typography>
      </Box>
    );
  }

  return null;
};

// Form section wrapper
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <Box className={`mb-6 ${className}`}>
      <Box className="mb-4">
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      <Box className="space-y-4">{children}</Box>
    </Box>
  );
};