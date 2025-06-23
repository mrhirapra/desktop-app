export const calculateTimeDifference = (start: number, end: number) => {
    const diffMs = Math.abs(end - start); // Difference in milliseconds
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
};

export const formatTimeDifference = ({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
