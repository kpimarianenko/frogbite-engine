import type { Entity } from '@/scene';

export abstract class Component {
  entity: Entity | null = null;
}

export type ComponentConstructor<T extends Component = Component> = abstract new (
  ...args: never[]
) => T;
