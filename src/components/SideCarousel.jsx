import React from 'react';
import { Box, Image, Text } from 'grommet';
import { FormPrevious, FormNext, StatusGood } from 'grommet-icons';
import styled from 'styled-components';
import Carousel from 'nuka-carousel';
import screenshotExplorer from '../assets/screenshot_explorer.png';
import screenshotSearch from '../assets/screenshot_search.png';

function Dot(props) {
  return styled.span`
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 4px;
    background-color: #1e64a3;
    margin: 7px 5px;
    opacity: ${props.selected ? '1' : '0.3'};
    transition-duration: 300ms;
  `.render();
}

const carouselProps = {
  renderCenterLeftControls: null,
  renderCenterRightControls: null,
  renderBottomLeftControls: ({ previousSlide }) => (
    <FormPrevious color="#1e64a399" onClick={previousSlide} cursor="pointer" />
  ),
  renderBottomRightControls: ({ nextSlide }) => (
    <FormNext color="#1e64a399" onClick={nextSlide} cursor="pointer" />
  ),
  renderBottomCenterControls: ({ currentSlide, slideCount }) =>
    [...Array(slideCount)].map((e, i) => <Dot key={i} selected={currentSlide === i} />),
  wrapAround: true,
  autoplay: true,
  autoplayInterval: 5000,
  speed: 333,
  easing: 'easeCubic',
  edgeEasing: 'easeCubic',
};

function SideCarousel(props) {
  return (
    <Carousel {...carouselProps}>
      <Box direction="column" height="medium">
        <Box direction="column" gap="7px" pad={{ top: 'small' }}>
          <Text size="xlarge" textAlign="center" weight="bold">
            Free Trial
          </Text>
          <Text size="20px" textAlign="center" color="secondary" weight={600}>
            Explore the T4 Platform
          </Text>
        </Box>
        <Box
          direction="column"
          gap="25px"
          pad={{ horizontal: 'large', bottom: 'large' }}
          justify="center"
          align="start"
          fill
        >
          <Box direction="row" gap="small">
            <StatusGood color="#1e64a3aa" />
            <Text>Full Industry Taxonomy</Text>
          </Box>
          <Box direction="row" gap="small">
            <StatusGood color="#1e64a3aa" />
            <Text>10 Free Searches</Text>
          </Box>
          <Box direction="row" gap="small">
            <StatusGood color="#1e64a3aa" />
            <Text>3 Results Per Search</Text>
          </Box>
        </Box>
      </Box>
      <Box direction="column" height="medium" pad={{ top: 'small' }}>
        <Box direction="column" gap="7px">
          <Text size="xlarge" textAlign="center" weight="bold">
            Instant Results
          </Text>
          <Text size="20px" textAlign="center" color="secondary" weight={600}>
            Find Reports In Seconds
          </Text>
          <Image src={screenshotSearch} fit="contain" margin={{ top: 'xsmall', bottom: 'large' }} />
        </Box>
      </Box>
      <Box direction="column" height="medium" pad={{ top: 'small' }}>
        <Box direction="column" gap="7px">
          <Text size="xlarge" textAlign="center" weight="bold">
            Full Industry Coverage
          </Text>
          <Text size="20px" textAlign="center" color="secondary" weight={600}>
            With Unprecedented Depth
          </Text>
          <Image
            src={screenshotExplorer}
            fit="contain"
            margin={{ top: 'xsmall', bottom: 'large' }}
          />
        </Box>
      </Box>
    </Carousel>
  );
}

export default SideCarousel;
