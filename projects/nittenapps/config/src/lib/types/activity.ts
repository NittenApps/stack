import { Component } from './component';
import { PropertyGroup } from './property-group';

export type Activity = Component & {
  propertyGroups?: PropertyGroup[];
}