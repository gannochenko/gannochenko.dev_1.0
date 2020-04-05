import styled from 'styled-components';
import { backgroundCover } from '@bucket-of-bolts/styled-companion';
import { Button } from '../Button';
import { absoluteCover, align } from '@bucket-of-bolts/styled-companion/build';

const cookies = require('../../../static/assets/aux/cookies.jpg') as string;

export const CookiePopupContainer = styled.div<{ displayed: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    position: fixed;
    bottom: 1rem;
    background-color: white;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    overflow: hidden;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.1);
    right: ${({ displayed }) => (displayed ? 0 : '-100%')};
    transition: right 700ms ease;
`;

export const Picture = styled.div`
    ${backgroundCover(cookies)};
    width: 7rem;
    ${({ theme }) => theme.util.media({ xs: 'display: none;' })}
    position: relative;
    &:hover > * {
        opacity: 1;
    }
`;

export const Text = styled.div`
    padding: 0.5rem 1rem;
    font-size: ${({ theme }) => theme.font.small};
    line-height: 1.5;
    position: relative;
`;

export const AgreeButton = styled(Button)`
    position: absolute;
    right: 1rem;
    bottom: 0.5rem;
`;

export const Copyright = styled.div`
    opacity: 0;
    ${absoluteCover()}
    background-color: white;
    color: ${({ theme }) => theme.color.secondary};
    font-size: ${({ theme }) => theme.font.micro};
    ${align('center', 'center', 'column')}
    transition: opacity 200ms ease;
`;