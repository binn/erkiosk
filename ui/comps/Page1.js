import Pages from './pages';
import { FormField, FormTextbox } from './formComponents';
import { Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import branding from './branding';

export default function Page1({ setNextPage, locale, state, setFacName, setShowButtons, settings }) {
    const [loading, setLoading] = useState(true);
    const [visitReason, setVisitReason] = useState(state.visitReason);
    const [social, setSocial] = useState(state.social);
    const [phone, setPhone] = useState(state.phone);
    const [email, setEmail] = useState(state.email);
    const [lang, setLang] = useState(settings.locales[locale]);

    useEffect(() => {
        if (loading) {
            setNextPage(Pages.Page2);
            setFacName(branding.facName);
            setShowButtons(true);
            setLoading(false);
        }
    });

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
            <Text fontSize="100%" mt={5}>Required Information</Text>
            <FormField
                label={lang.ssn}
                helperText={lang.ssnHelper}
                placeholder='XXX-XX-XXXX'
                value={social}
                maxLength={11}
                mt={4}
                onChange={(e) => {
                    var val = e.currentTarget.value.replace(/\D/g, '');
                    var newVal = '';

                    if (val.length > 4) {
                        e.currentTarget.value = val;
                    }

                    if ((val.length > 3) && (val.length < 6)) {
                        newVal += val.substr(0, 3) + '-';
                        val = val.substr(3);
                    }

                    if (val.length > 5) {
                        newVal += val.substr(0, 3) + '-';
                        newVal += val.substr(3, 2) + '-';
                        val = val.substr(5);
                    }

                    newVal += val;
                    setSocial(newVal);
                    state.social = newVal;
                }}
            />

            <FormField
                label={lang.phone}
                placeholder='(123) 456-7890'
                helperText={lang.phoneHelper}
                onKeyDown={(e) => {
                    enforceFormat(e);
                }}
                onChange={(e) => {
                    formatToPhone(e);
                    let p = e.currentTarget.value;

                    state.phone = p;
                    setPhone(p);
                }}
                value={phone}
            />

            <FormField
                label={lang.email}
                placeholder='me@example.com'
                helperText={lang.emailHelper}
                type='email'
                onChange={(e) => {
                    let email1 = e.currentTarget.value;

                    setEmail(email1);
                    state.email = email1;
                }}
                value={email}
            />
        </>
    );
}
