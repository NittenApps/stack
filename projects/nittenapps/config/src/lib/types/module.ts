import { Activity } from './activity';
import { Component } from './component';

export type Module = Component & {
  activities?: Activity[];
};
