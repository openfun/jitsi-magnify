export const indexTemplate = (componentName: string) =>
  `export { default, ${componentName}Props } from './${componentName}';\n`;

export const componentTemplate = (
  componentName: string
) => `import { defineMessages, useIntl } from 'react-intl';
import React from 'react';

export interface ${componentName}Props {
}

const messages = defineMessages({});

const ${componentName} = (props: ${componentName}Props) => {
  const intl = useIntl();

  return <></>;
};

export default ${componentName};
`;

export const storiesTemplate = (
  componentName: string,
  componentDirectories: string[]
) => `import React from 'react';
import ${componentName} from './${componentName}';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: '${componentDirectories.join("/")}',
  component: ${componentName},
} as ComponentMeta<typeof ${componentName}>;

const Template: ComponentStory<typeof ${componentName}> = (args) => <${componentName} {...args} />;

// create the template and stories
export const basic${componentName} = Template.bind({});
basic${componentName}.args = {
};
`;

export const testTemplate = (
  componentName: string
) => `import React from 'react';
import { IntlProvider } from 'react-intl';
import ${componentName} from './${componentName}';
import { render, screen } from '@testing-library/react';

describe('${componentName}', () => {
  it('should render successfully', () => {
    render(
      <IntlProvider locale="en">
        <${componentName} />
      </IntlProvider>,
    );
  });
});
`;

export const defaultAsTemplate = (componentName: string) =>
  `export { default as ${componentName} } from './${componentName}';\n`;

export const exportAllTemplate = (subFolderName: string) =>
  `export * from './${subFolderName}';\n`;
