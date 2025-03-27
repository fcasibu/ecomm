'use client';

import { Autocomplete } from '@/features/algolia/components/autocomplete';
import { InstantSearchQueryProvider } from '@/features/algolia/providers/instant-search-query-provider';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { X } from 'lucide-react';
import { useId } from 'react';

const styles = `
  .aa-Autocomplete {
    width: 100%;
  }

  .aa-Source[data-autocomplete-source-id="recentSearches"] {
    .aa-List {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }

  .aa-List {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .aa-Form {
    width: 100%;
    border-bottom: 1px solid #e0e0e0; 
    display: flex;
    align-items: center;
    position: relative;
  }

  .aa-Input {
    width: 100%;
    padding: 0 0 0 8px;
    border: none;
    outline: none;
    color: #333;
    background-color: transparent;
  }
  .aa-Input::placeholder {
    color: #aaa;
  }

  .aa-InputWrapper {
     width: 100%;
     position: relative;
     display: flex;
     align-items: center;
  }

  .aa-InputWrapperSuffix {
    display: none;
  }

  .aa-SubmitButton {
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    width: 24px;
    height: 24px;
  }

  .aa-SubmitIcon {
    width: 20px;
    height: 20px;
    stroke-width: 2;
  }

  .aa-ClearButton {
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    width: 24px;
    height: 24px;
  }
  .aa-ClearButton:hover {
    color: #333;
  }

  .aa-ClearIcon {
    width: 18px;
    height: 18px;
    stroke-width: 2.5;
  }

  .aa-Highlight {
    background-color: #ffe0e0;
    color: inherit;
  }

  .aa-Panel {
    overflow-y: auto;
    height: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 1rem;
    padding-left: 1rem;

    @media (min-width: 1440px) {
      max-width: 1440px !important;
      padding-right: 1rem;
      padding-left: 1rem;
    }
  }
`;

export function SearchContent({ close }: { close: () => void }) {
  const t = useScopedI18n('searchMenu');
  const id = useId();

  return (
    <InstantSearchQueryProvider>
      <div id={id} className="fixed left-0 top-0 z-50 h-full w-full bg-white">
        <div className="container">
          <div className="flex items-center justify-between">
            <style
              dangerouslySetInnerHTML={{
                __html: styles,
              }}
            />
            <Autocomplete
              className="w-full py-3"
              detachedMediaQuery="none"
              panelContainer={`#${id}`}
              placeholder={t('placeholder')}
            />
            <Button
              variant="none"
              size="icon"
              aria-label={t('actions.close')}
              type="button"
              className="bg-transparent"
              onClick={close}
            >
              <X aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </InstantSearchQueryProvider>
  );
}
