import { Center, Container, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Text, Heading, Image, Input, Spinner, Box, Button, Icon, Select } from "@chakra-ui/react";
import { useState, useEffect } from 'react';

import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import branding from "../comps/branding";
import Pages from '../comps/pages';

// import pages
import Page1 from '../comps/Page1';
import Page2 from '../comps/Page2';
import LanguagePage from '../comps/LanguagePage';

function ERKiosk({ connection, settings }) {
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');
  const [nextPage, setNextPage] = useState(Pages.Page1);
  const [previousPages, setPreviousPages] = useState([Pages.LanguagePage]);
  const [page, setPage] = useState(Pages.LanguagePage);
  const [state, setState] = useState({});
  const [pendingKioskOpen, setPendingKioskOpen] = useState(true);
  const [facName, setFacName] = useState(branding.facName);
  const [showButtons, setShowButtons] = useState(false);
  const [finishNext, setFinishNext] = useState(false);
  const [lang, setLang] = useState(settings.locales[locale]);

  useEffect(() => {
    if (loading) {
      // ensure light mode is enabled
      localStorage.setItem("chakra-ui-color-mode", "light");

      connection.on('OpenKiosk', patient => {
        fetch('http://localhost:5133/recording/begin').catch(e => { });

        setState({
          id: patient.id,
          firstName: patient.first,
          lastName: patient.last,
          social: patient.social,
          phone: patient.phone,
          email: patient.email,
          emergencyContact: {
            relationship: patient.emergencyContactRelationship ? patient.emergencyContactRelationship : 'Spouse',
            firstName: patient.emergencyContactFirst,
            lastName: patient.emergencyContactLast,
            phone: patient.emergencyContactPhone,
          },
        });

        setPage(Pages.LanguagePage);
        setPendingKioskOpen(false);
      });

      connection.on('CloseKiosk', () => {
        fetch('http://localhost:5133/recording/end').catch(e => { });

        setPage(Pages.Submission);
        setState({});
        setPendingKioskOpen(true);
      });

      setLoading(false);
    }
  });

  if (loading)
    return (
      <Center>
        <Spinner mt={100} />
      </Center>
    );

  if (pendingKioskOpen)
    return (
      <>
        <Center h='100vh'>
          <Image w='40%' h='auto' src={branding.logoUrl} animation='animation 3s infinite' />
        </Center>
      </>
    );

  const back = () => {
    setPage(previousPages[previousPages.length - 1]);
    delete previousPages[previousPages.length - 1];
  }

  const next = () => {
    if (finishNext)
      return setPage(Pages.Submission);

    if (nextPage === page)
      return;

    previousPages.push(page);
    setPage(nextPage);
  }

  return (
    <Center h='100vh'>
      <Box
        p={50}
        w={'50%'}
        h={'90%'}
        borderWidth='1px'
        shadow='md'
        borderRadius='10px'
        position='relative'
      >
        <Center>
          <Image w="50%" h="auto" src={branding.logoUrl} />
        </Center>

        <Page setFinishNext={setFinishNext} settings={settings} page={page} setLocale={(e) => {
          setLocale(e);
          setLang(settings.locales[e]);
        }} setNextPage={setNextPage} setState={setState} connection={connection} setPendingKioskOpen={setPendingKioskOpen} locale={locale} state={state} setFacName={setFacName} setShowButtons={setShowButtons} next={next} />

        <Center hidden={!showButtons}>
          <Container position='absolute' maxW='100%' bottom={16}>
            <Button position='absolute' w='45%' left={5} leftIcon={<Icon as={AiOutlineArrowLeft} />} onClick={back}>{lang.previous}</Button>
            <Button position='absolute' w='45%' right={5} rightIcon={<Icon as={AiOutlineArrowRight} />} onClick={next}>{finishNext ? lang.finish : lang.next}</Button>
          </Container>
        </Center>
      </Box>
    </Center>
  );
}

function Page({ page, setLocale, setNextPage, locale, state, setFacName, next, connection, setShowButtons, settings, setFinishNext, setState, setPendingKioskOpen }) {
  switch (page) {
    case Pages.Page1:
      setFinishNext(false);
      return <Page1 setNextPage={setNextPage} locale={locale} state={state} setFacName={setFacName} settings={settings} setShowButtons={setShowButtons} />;
    case Pages.Page2:
      setFinishNext(true);
      return <Page2 setNextPage={setNextPage} locale={locale} state={state} setFacName={setFacName} settings={settings} setShowButtons={setShowButtons} />;
    case Pages.Submission:
      (async () => {
        await connection.invoke('CompletePatient', {
          id: state.id,
          first: state.firstName,
          last: state.lastName,
          social: state.social,
          phone: state.phone,
          email: state.email,
          language: locale === 'en' ? 'ENGLISH' : 'SPANISH',
          emergencyContactFirst: state.emergencyContact.firstName,
          emergencyContactLast: state.emergencyContact.lastName,
          emergencyContactPhone: state.emergencyContact.phone,
          emergencyContactRelationship: state.emergencyContact.relationship,
          completed: true,
        });

        fetch('http://localhost:5133/recording/end').catch(e => { });
        setShowButtons(false);
        setState({});
        setPendingKioskOpen(true);
      })();

      return (
        <>
          <Center mt={40}>
            <Spinner />
          </Center>
        </>
      );
    default:
      setFinishNext(false);
      return <LanguagePage setLocale={setLocale} setNextPage={setNextPage} locale={locale} state={state} settings={settings} setFacName={setFacName} next={next} setShowButtons={setShowButtons} />;
  }
}

export default ERKiosk;