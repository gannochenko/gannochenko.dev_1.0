import React, { FunctionComponent } from 'react';
import { graphql, Link } from 'gatsby';

import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';

import { BlockRenderer } from '../lib/block-renderer';
import { Node } from '../lib/type';

interface Props {
    data: {
        allMarkdownRemark: {
            nodes: Node[];
        };
    };
}

const SuperPowersPage: FunctionComponent<Props> = ({ data = {} }) => {
    const { allMarkdownRemark: { nodes = [] } = {} } = data;

    return (
        <Layout shortHeader>
            <SEO title="Super powers" keywords={['']} />
            <Link to="/">Back</Link>
            {BlockRenderer.render(nodes)}
        </Layout>
    );
};

export const query = graphql`
    query SuperPowersPageQuery {
        allMarkdownRemark(
            sort: { fields: frontmatter___sort, order: ASC }
            filter: { frontmatter: { pathname: { eq: "/superpowers/" } } }
        ) {
            nodes {
                id
                html
                rawMarkdownBody
                frontmatter {
                    graphics {
                        author
                        source
                        sourceText
                    }
                }
            }
        }
    }
`;

export default SuperPowersPage;