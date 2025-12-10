export interface FormattedResponse {
  markdown: string;
}

export enum ViewMode {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
  SPLIT = 'SPLIT'
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}