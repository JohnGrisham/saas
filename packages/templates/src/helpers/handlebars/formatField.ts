import Handlebars from 'handlebars';

export const formatField = (
  context: any,
  options: Handlebars.HelperOptions,
) => {
  const signedIn = options.data.root.signedin;

  if (signedIn) {
    return new Handlebars.SafeString(`<div class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
      <label for="name" class="block text-xs font-medium text-gray-900">Name</label>
      <input type="text" name="name" id="name" class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" value="${Handlebars.escapeExpression(
        options
          .fn(context)
          .replace(/(<([^>]+)>)/gi, '')
          .replace(/['"]+/g, ''),
      )}">
    </div>`);
  } else {
    return new Handlebars.SafeString(options.fn(context));
  }
};
