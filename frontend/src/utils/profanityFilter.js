import filter from "leo-profanity";

filter.clearList();

filter.add(filter.getDictionary("en"));
filter.add(filter.getDictionary("ru"));

const cleanText = (text) => filter.clean(text);

export default cleanText;