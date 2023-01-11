const format = function (mesurement, fields, tags = {}, timestamp = undefined) {
  if (!mesurement || typeof mesurement !== "string") {
    throw new Error("Measurement should be string");
  }

  mesurement = escapeString(mesurement);

  if (!fields || !isObject(fields)) {
    throw new Error("Fields should be an object");
  }

  let escaped_fields_array = [];
  let unescaped_fields_keys = Object.keys(fields) || [];
  for (let i = 0; i < unescaped_fields_keys.length; i++) {
    escaped_fields_array.push(
      escapeString(unescaped_fields_keys[i]) +
        "=" +
        fields[unescaped_fields_keys[i]]
    );
  }
  let escaped_fields_str = escaped_fields_array.join(",");

  let escapeTags = "";

  if (!isObject(tags)) {
    throw new Error("tags if provied should be an object");
  }

  let esapedTagsArray = [];
  for (let tagKey in tags) {
    esapedTagsArray.push(escapeString(tagKey)+'='+escapeString(tags[tagKey]));
  }
  escapeTags = esapedTagsArray.join(",");

  timestamp = timestamp || process.hrtime.bigint();

  let data = `${mesurement}${
    escapeTags.length > 0 ? "," + escapeTags : ""
  } ${escaped_fields_str} ${timestamp}`;

  return data;
};

const isObject = function (obj) {
  let type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
};

const escapeString = function (str) {
  if (!str)
    return ""
  
  return str
    .split("")
    .map(function (character) {
      if (character === " " || character === ",") {
        character = "\\" + character;
      }
      return character;
    })
    .join("");
};

module.exports = { format };
