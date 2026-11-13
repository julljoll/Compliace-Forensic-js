import React from 'react';
import { render } from '@testing-library/react';

export function renderWithTheme(ui: React.ReactElement) {
  return render(<div data-theme="uswds">{ui}</div>);
}
