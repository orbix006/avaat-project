// Responsibility: Shared utility types used across the app
import { ReactNode } from 'react';

export type BaseComponentProps = {
  className?: string;
  children?: ReactNode;
};

export type WithChildren = {
  children: ReactNode;
};