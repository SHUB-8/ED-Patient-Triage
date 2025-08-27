export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
};

export const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ago`;
  }
};