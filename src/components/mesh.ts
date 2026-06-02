import { Component } from './component';

// TODO: implement MeshComponent
export class MeshComponent extends Component {
  type = 'mesh' as const;
  vertices: number[] = [];
  indices: number[] = [];
}
