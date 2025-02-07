
export const formatText = (text: string): string => {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    // Italic
    .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
    // Underline
    .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
    // Lists
    .replace(/\n- (.*)/g, '<br/>• $1')
    // Additional line breaks
    .replace(/\n/g, '<br/>');
};

