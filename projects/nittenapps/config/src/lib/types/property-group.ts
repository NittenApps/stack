import { Component } from './component';
import { Property } from './property';

export type PropertyGroup = Component & {
  properties?: Property[];
};
