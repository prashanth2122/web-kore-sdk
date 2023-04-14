/** @ignore */
declare class AgentDesktopPlugin {
    name: any;
    config: any;
    agentDesktopInfo: any;
    $: any;
    isTyping: boolean;
    typingTimer: any;
    stopTypingInterval: number;
    isTabActive: boolean;
    isReadRecipetSent: boolean;
    constructor(config?: any);
    onHostCreate(): void;
    onInit(): void;
    appendVideoAudioElemnts(): void;
    extend(target: any, source: any): any;
    sendStopTypingEvent(): void;
    removeEmptyBubblesInTemplate(): void;
}
export default AgentDesktopPlugin;
