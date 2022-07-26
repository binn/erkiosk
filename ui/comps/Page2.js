import { Text, Flex, FormLabel, Button, SimpleGrid, FormHelperText, FormControl } from '@chakra-ui/react';
import { FormField } from './formComponents';
import { useState } from 'react';

function Page2({ settings, locale, state }) {
    const [firstName, setFirstName] = useState(state.emergencyContact.firstName);
    const [lastName, setLastName] = useState(state.emergencyContact.lastName);
    const [phone, setPhone] = useState(state.emergencyContact.phone);
    const [lang, setLang] = useState(settings.locales[locale]);
    const [relationship, setRelationship] = useState(state.emergencyContact.relationship ? state.emergencyContact.relationship : "spouse");

    const isNumericInput = (event) => {
        const key = event.keyCode;
        return ((key >= 48 && key <= 57) || // Allow number line
            (key >= 96 && key <= 105) // Allow number pad
        );
    };

    const isModifierKey = (event) => {
        const key = event.keyCode;
        return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
            (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
            (key > 36 && key < 41) || // Allow left, up, right, down
            (
                // Allow Ctrl/Command + A,C,V,X,Z
                (event.ctrlKey === true || event.metaKey === true) &&
                (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
            )
    };

    const enforceFormat = (event) => {
        // Input must be of a valid number format or a modifier key, and not longer than ten digits
        if (!isNumericInput(event) && !isModifierKey(event)) {
            event.preventDefault();
        }
    };

    const formatToPhone = (event) => {
        if (isModifierKey(event)) { return; }

        const input = event.target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
        const areaCode = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const last = input.substring(6, 10);

        if (input.length > 6) { event.target.value = `(${areaCode}) ${middle}-${last}`; }
        else if (input.length > 3) { event.target.value = `(${areaCode}) ${middle}`; }
        else if (input.length > 0) { event.target.value = `(${areaCode}`; }
    };

    return (
        <>
            <Text fontSize='100%' mt={5}>Emergency Contact</Text>

            <FormControl>
                <Flex mt={-6}>
                    <FormField
                        placeholder={lang.emergencyContact.firstName}
                        errorText={lang.emergencyContact.firstNameError}
                        label={lang.emergencyContact.firstName}
                        labelName={true}
                        mr={4}
                        value={firstName}
                        onChange={(e) => {
                            e.currentTarget.value = e.currentTarget.value.toLocaleUpperCase();

                            setFirstName(e.currentTarget.value);
                            state.emergencyContact.firstName = e.currentTarget.value;
                        }}
                    />

                    <FormField
                        placeholder={lang.emergencyContact.lastName}
                        errorText={lang.emergencyContact.lastNameError}
                        label={lang.emergencyContact.lastName}
                        labelName={true}
                        value={lastName}
                        onChange={(e) => {
                            e.currentTarget.value = e.currentTarget.value.toLocaleUpperCase();

                            setLastName(e.currentTarget.value);
                            state.emergencyContact.lastName = e.currentTarget.value;
                        }}
                    />
                </Flex>
                <FormHelperText mt={-1.5}>{lang.emergencyContact.nameHelper}</FormHelperText>
            </FormControl>

            <FormField
                label={lang.emergencyContact.phone}
                placeholder='(123) 456-7890'
                helperText={lang.emergencyContact.phoneHelper}
                onKeyDown={(e) => {
                    enforceFormat(e);
                }}
                onChange={(e) => {
                    formatToPhone(e);
                    let p = e.currentTarget.value;

                    state.emergencyContact.phone = p;
                    setPhone(p);
                }}
                value={phone}
            />

            <FormLabel mt={10}>{lang.emergencyContact.relationship}</FormLabel>
            <SimpleGrid
                columns={5}
                spacing={2}
            >
                <Button
                    bg={relationship === "Spouse" ? 'lightblue' : ''}
                    onClick={() => {
                        setRelationship("Spouse");
                        state.emergencyContact.relationship = "Spouse";
                    }}
                >
                    {lang.emergencyContact.relationshipOptions.spouse}
                </Button>
                <Button
                    bg={relationship === "Parent" ? 'lightblue' : ''}
                    onClick={() => {
                        setRelationship("Parent");
                        state.emergencyContact.relationship = "Parent";
                    }}
                >
                    {lang.emergencyContact.relationshipOptions.parent}
                </Button>
                <Button
                    bg={relationship === "Child" ? 'lightblue' : ''}
                    onClick={() => {
                        setRelationship("Child");
                        state.emergencyContact.relationship = "Child";
                    }}
                >
                    {lang.emergencyContact.relationshipOptions.child}
                </Button>
                <Button
                    bg={relationship === "Relative" ? 'lightblue' : ''}
                    onClick={() => {
                        setRelationship("Relative");
                        state.emergencyContact.relationship = "Relative";
                    }}
                >
                    {lang.emergencyContact.relationshipOptions.relative}
                </Button>
                <Button
                    bg={relationship === "Other" ? 'lightblue' : ''}
                    onClick={() => {
                        setRelationship("Other");
                        state.emergencyContact.relationship = "Other";
                    }}
                >
                    {lang.emergencyContact.relationshipOptions.other}
                </Button>
            </SimpleGrid>
        </>
    );
}

export default Page2;