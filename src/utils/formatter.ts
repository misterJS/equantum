export const formatPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.length !== 12) {
    throw new Error("Phone number must be 12 digits long");
  }

  const countryCode = "+62";
  const part1 = phoneNumber.slice(1, 4);
  const part2 = phoneNumber.slice(4, 8);
  const part3 = phoneNumber.slice(8, 12);

  return `${countryCode}${part1}-${part2}-${part3}`;
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
};
