export type RemoveOptional<Type> = {
    [Property in keyof Type]-?: Type[Property];
};


