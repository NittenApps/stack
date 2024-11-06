import { ChangeDetectionStrategy, Component, OnInit, Type } from '@angular/core';
import { FieldTypeConfig, StackFieldConfig } from '@nittenapps/forms';
import { StackFieldSelectProps } from '@nittenapps/forms/select';
import { FieldType, StackFieldProps } from '../form-field';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, of, startWith, switchMap, tap } from 'rxjs';

interface AutocompleteProps extends StackFieldProps, StackFieldSelectProps {
  multiple?: boolean;
  selectAllOption?: string;
  disableOptionCentering?: boolean;
  typeaheadDebounceInterval?: number;
  displayWith: ((value: any) => string) | null;
  panelClass?: string;
}

export interface StackAutocompleteFieldConfig extends StackFieldConfig<AutocompleteProps> {
  type: 'autocomplete' | Type<StackFieldAutocomplete>;
}

@Component({
  selector: 'nas-field-mat-autocomplete',
  templateUrl: './autocomplete.type.html',
})
export class StackFieldAutocomplete extends FieldType<FieldTypeConfig<AutocompleteProps>> implements OnInit {
  filteredOptions?: Observable<any[]>;

  override defaultOptions = {
    props: {
      displayWith(value: any): string {
        return value ? value.code + ' - ' + value.name : '';
      },
    },
  };

  ngOnInit(): void {
    console.log('ngOnInit', this.formControl);
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      tap(console.log),
      switchMap((term) => this.filterOptions(term))
    );
  }

  optionSelected($event: MatAutocompleteSelectedEvent): void {
    this.props.change?.(this.field, $event);
  }

  private filterOptions(term: string): Observable<any[]> {
    if (!this.props.options) {
      return of([]);
    }

    if (!term) {
      if (this.props.options instanceof Observable) {
        return this.props.options;
      }
      return of(this.props.options);
    }

    term = term.toLowerCase();
    if (this.props.options instanceof Observable) {
      return this.props.options.pipe(
        map((options: any[]) =>
          options.filter(
            (option) => option.code?.toLowerCase().includes(term) || option.name?.toLowerCase().includes(term)
          )
        )
      );
    }
    return of(
      this.props.options.filter(
        (option) => option.code?.toLowerCase().includes(term) || option.name?.toLowerCase().includes(term)
      )
    );
  }
}
