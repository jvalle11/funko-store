/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

// /**
//  * @type {import('gatsby').GatsbySSR['onRenderBody']}
//  */
// exports.onRenderBody = ({ setHtmlAttributes }) => {
//   setHtmlAttributes({ lang: `en` })
// }

import React from "react";

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="fix-window"
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window === "undefined") {
            global.window = {};
          }
        `,
      }}
    />,
  ]);
};
