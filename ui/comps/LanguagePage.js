import Pages from './pages';
import { Flex, FormLabel, Button, Icon, Text, Center, Container, FormHelperText, FormControl } from '@chakra-ui/react';
import { GrCheckmark } from 'react-icons/gr';
import branding from './branding';

import { useEffect, useState } from 'react';

function LanguagePage({ setLocale, setNextPage, locale, setFacName, settings, setShowButtons, next, state }) {
    const [lang, setLang] = useState(settings.locales[locale]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            setLoading(false);
        }
    });

    setNextPage(Pages.Page1);
    setFacName('Select Language');
    setShowButtons(false);

    return (
        <>
            <Container maxW='100%' mt={100}>
                <Center>
                    <Text fontSize='80%' animation='animation 3s infinite' mb={5}>{lang.greeting}, {state.firstName}!</Text>
                </Center>

                <Center>
                    <Button
                        w='90%'
                        h={100}
                        onClick={() => {
                            setLocale('en');
                            next();
                        }}
                    >
                        English
                    </Button>
                </Center>

                <Center>
                    <Button
                        w='90%'
                        h={100}
                        onClick={() => {
                            setLocale('es');
                            next();
                        }}
                        mt={15}
                    >
                        Español
                    </Button>
                </Center>

                <FormControl>
                    <Center>
                        <FormHelperText mt={5}>Please select a language to continue.</FormHelperText>
                    </Center>
                </FormControl>
            </Container>
        </>
    );
}

export default LanguagePage;
