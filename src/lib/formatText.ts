
export const formatText = (text: string): string => {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.*?)~~/g, '<s>$1</s>')
    // Lists
    .replace(/\n- (.*)/g, '\n• $1')
    // Additional line breaks
    .replace(/\n/g, '<br/>');
};
