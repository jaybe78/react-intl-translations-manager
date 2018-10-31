/**
 * Created by i315756 on 10/30/18.
 */
export const toObject = (array) => {
  array.reduce((acc, lang) => {
    return { ...acc, [lang]: { } };
  }, {});
}





