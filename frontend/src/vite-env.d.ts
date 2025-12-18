declare module '*.jsx' {
    const content: React.ComponentType<any>;
    export default content;
}

declare module '*.js' {
    const content: any;
    export default content;
}
