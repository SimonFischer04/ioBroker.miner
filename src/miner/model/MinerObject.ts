export enum MinerObject {
    controls = 'control',
    info = 'info',
    running = `${MinerObject.controls}.running`
}