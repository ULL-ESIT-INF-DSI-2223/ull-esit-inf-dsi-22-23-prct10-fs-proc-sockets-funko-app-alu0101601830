import { Funko } from './funko.js';

export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  funkoPop?: Funko;
};

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  funkoPops?: Funko[];
};
