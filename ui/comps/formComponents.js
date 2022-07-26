import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText, Select, Textarea } from '@chakra-ui/react';

function FormField({ type = 'text', label, placeholder, errorText, helperText, labelName, invalid = false, mt = 10, onChange, onKeyDown, ml = 0, mr = 0, mb = 0, value, disabled = false, w, maxLength }) {
    return (
        <FormControl mt={mt} ml={ml} mr={mr} mb={mb} isInvalid={invalid}>
            <FormLabel mb={labelName ? -8 : -3}>{label}</FormLabel>
            <Input type={type} maxLength={maxLength} value={value} borderWidth='2px' placeholder={placeholder} onChange={onChange} onKeyDown={onKeyDown} disabled={disabled} w={w} />
            {invalid ? <FormErrorMessage>{errorText}</FormErrorMessage> : <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}

function FormSelect({ label, placeholder, options, errorText, helperText, invalid = false, mt = 10, onChange, ml = 0, mr = 0, mb = 0, value }) {
    return (
        <FormControl mt={mt} ml={ml} mr={mr} mb={mb} isInvalid={invalid}>
            <FormLabel>{label}</FormLabel>
            <Select borderWidth='2px' onChange={onChange} placeholder={placeholder} value={value}>
                {options}
            </Select>
            {invalid ? <FormErrorMessage>{errorText}</FormErrorMessage> : <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}

function FormTextbox({ label, placeholder, errorText, helperText, invalid = false, mt = 10, onChange, h = 40, ml = 0, mr = 0, mb = 0, value, disabled = false }) {
    return (
        <FormControl mt={mt} ml={ml} mr={mr} mb={mb} isInvalid={invalid}>
            <FormLabel>{label}</FormLabel>
            <Textarea value={value} placeholder={placeholder} onChange={onChange} h={h} borderWidth='2px' disabled={disabled} />
            {invalid ? <FormErrorMessage>{errorText}</FormErrorMessage> : <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}

export {
    FormField,
    FormSelect,
    FormTextbox,
};