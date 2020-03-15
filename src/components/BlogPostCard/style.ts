import styled, { css } from 'styled-components';
import Img from 'gatsby-image';

import { Link } from '../Link';
import { align } from '@bucket-of-bolts/styled-companion/build';
import { Typography } from '../Typography';

export const BlogPostCardContainer = styled.div`
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    overflow: hidden;
`;

export const Image = styled(Img)`
    background-color: #c4c4c4;
    ${({ theme }) =>
        theme.util.media({
            lg: `max-height: 10rem;`,
            md: `max-height: 15rem;`,
        })}
`;

export const Data = styled.div`
    padding: 1rem;
`;

export const LinkContainer = styled.div`
    ${align('top', 'right')}
`;

export const ViewPost = styled(Link)`
    text-align: right;
    ${({ theme }) => css`
        font-size: ${theme.font.small};
    `}
`;

export const Title = styled(Typography).attrs({ sub: true })`
    margin-top: 0;
    min-height: 3rem;
    ${({ theme }) =>
        theme.util.media({
            lg: `font-size: ${theme.font.standard};`,
            md: 'min-height: 5rem;',
        })}
`;

export const Date = styled.div``;