let commandBuffer = [];

export const sendCommand = (command) => {
    commandBuffer.push(command);
}

export const getBuffer = () => {
    return commandBuffer;
}
