"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  return function postTextStory(content, font, background, callback) {
    var resolveFunc = function () {};
    var rejectFunc = function () {};
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = function (err) {
        if (err) return rejectFunc(err);
        resolveFunc();
      };
    }
    if (utils.getType(font) != "String") font = "233490655168261";
    if (utils.getType(background) != "String") background = "401372137331149";
    var form = {
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: "StoriesCreateMutation",
      //   This doc_is is valid as of April 22, 2024
      doc_id: "6197602830367217",
      variables: JSON.stringify({
        input: {
          message: {
            ranges: [],
            text: content,
          },
          actor_id: ctx.userID,
          text_format_preset_id: background,
          text_format_metadata: {
            inspirations_custom_font_id: font,
          },
          audiences: [
            {
              stories: {
                self: {
                  target_id: ctx.userID,
                },
              },
            },
          ],
          tracking: [null],
          navigation_data: {
            attribution_id_v2:
              "StoriesCreateRoot.react,comet.stories.create,unexpected,1713705864303,50759,,,;CometHomeRoot.react,comet.home,tap_tabbar,1713705859464,975181,4748854339,,",
          },
          source: "WWW",
          client_mutation_id: Math.round(Math.random() * 1024).toString(),
        },
      }),
      av: ctx.userID,
    };

    defaultFuncs
      .post("https://www.facebook.com/api/graphql/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.errors) throw resData;
        return callback();
      })
      .catch(function (err) {
        log.error("postTextStory", err);
        return callback(err);
      });

    return returnPromise;
  };
};
