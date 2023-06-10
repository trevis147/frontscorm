/*! For license information please see scorm1p2progressStatic.js.LICENSE.txt */
(() => {
  "use strict";
  var e, t;
  !(function (e) {
    (e.CHOICE = "choice"), (e.FILL_IN = "fill-in"), (e.LIKERT = "likert");
  })(e || (e = {})),
    (function (e) {
      (e.CORRECT = "correct"),
        (e.WRONG = "wrong"),
        (e.UNANTICIPATED = "unanticipated"),
        (e.NEUTRAL = "neutral");
    })(t || (t = {}));
  var i,
    n = {
      UTILS: {},
      debug: { isActive: !0 },
      SCORM: {
        version: null,
        handleCompletionStatus: !0,
        handleExitMode: !0,
        API: { handle: null, isFound: !1 },
        connection: { isActive: !1 },
        data: { completionStatus: null, exitStatus: null },
        debug: {},
      },
    };
  (n.SCORM.isAvailable = function () {
    return !0;
  }),
    (n.SCORM.API.find = function (e) {
      for (
        var t = null, i = 0, s = n.UTILS.trace, a = n.SCORM;
        !e.API && !e.API_1484_11 && e.parent && e.parent != e && i <= 500;

      )
        i++, (e = e.parent);
      if (a.version)
        switch (a.version) {
          case "1.2":
            e.API
              ? (t = e.API)
              : s(
                  "SCORM.API.find: SCORM version 1.2 was specified by user, but API cannot be found."
                );
            break;
          case "2004":
            e.API_1484_11
              ? (t = e.API_1484_11)
              : s(
                  "SCORM.API.find: SCORM version 2004 was specified by user, but API_1484_11 cannot be found."
                );
        }
      else
        e.API
          ? ((a.version = "1.2"), (t = e.API))
          : e.API_1484_11 && ((a.version = "2004"), (t = e.API_1484_11));
      return (
        t
          ? (s("SCORM.API.find: API found. Version: " + a.version),
            s("API: " + t))
          : s(
              "SCORM.API.find: Error finding API. \nFind attempts: " +
                i +
                ". \nFind attempt limit: 500"
            ),
        t
      );
    }),
    (n.SCORM.API.get = function () {
      var e = null,
        t = window,
        i = n.SCORM,
        s = i.API.find,
        a = n.UTILS.trace;
      return (
        t.parent && t.parent != t && (e = s(t.parent)),
        !e && t.top.opener && (e = s(t.top.opener)),
        !e &&
          t.top.opener &&
          t.top.opener.document &&
          (e = s(t.top.opener.document)),
        e ? (i.API.isFound = !0) : a("API.get failed: Can't find the API!"),
        e
      );
    }),
    (n.SCORM.API.getHandle = function () {
      var e = n.SCORM.API;
      return e.handle || e.isFound || (e.handle = e.get()), e.handle;
    }),
    (n.SCORM.connection.initialize = function () {
      var e = !1,
        t = n.SCORM,
        s = t.data.completionStatus,
        a = n.UTILS.trace,
        o = n.UTILS.StringToBoolean,
        r = t.debug,
        c = "SCORM.connection.initialize ";
      if (
        ((i = new Date()),
        a("connection.initialize called."),
        t.connection.isActive)
      )
        a(c + "aborted: Connection already active.");
      else {
        var l = t.API.getHandle(),
          d = 0;
        if (l) {
          switch (t.version) {
            case "1.2":
              e = o(l.LMSInitialize(""));
              break;
            case "2004":
              e = o(l.Initialize(""));
          }
          if (e)
            if (null !== (d = r.getCode()) && 0 === d) {
              if (
                ((t.connection.isActive = !0),
                t.handleCompletionStatus && (s = t.status("get")))
              )
                switch (s) {
                  case "not attempted":
                  case "unknown":
                    t.status("set", "incomplete");
                }
            } else
              (e = !1),
                a(
                  c +
                    "failed. \nError code: " +
                    d +
                    " \nError info: " +
                    r.getInfo(d)
                );
          else
            a(
              null !== (d = r.getCode()) && 0 !== d
                ? c +
                    "failed. \nError code: " +
                    d +
                    " \nError info: " +
                    r.getInfo(d)
                : c + "failed: No response from server."
            );
        } else a(c + "failed: API is null.");
      }
      return e;
    }),
    (n.SCORM.connection.terminate = function () {
      var e = !1,
        t = n.SCORM,
        i = t.data.exitStatus,
        s = t.data.completionStatus,
        a = n.UTILS.trace,
        o = n.UTILS.StringToBoolean,
        r = t.debug,
        c = "SCORM.connection.terminate ";
      if (t.connection.isActive) {
        var l = t.API.getHandle(),
          d = 0;
        if (l) {
          if (t.handleExitMode && !i)
            if ("completed" !== s && "passed" !== s)
              switch (t.version) {
                case "1.2":
                  e = t.set("cmi.core.exit", "suspend");
                  break;
                case "2004":
                  e = t.set("cmi.exit", "suspend");
              }
            else
              switch (t.version) {
                case "1.2":
                  e = t.set("cmi.core.exit", "");
                  break;
                case "2004":
                  e = t.set("cmi.exit", "normal");
              }
          if ((e = t.save())) {
            switch (t.version) {
              case "1.2":
                e = o(l.LMSFinish(""));
                break;
              case "2004":
                e = o(l.Terminate(""));
            }
            e
              ? (t.connection.isActive = !1)
              : a(
                  c +
                    "failed. \nError code: " +
                    (d = r.getCode()) +
                    " \nError info: " +
                    r.getInfo(d)
                );
          }
        } else a(c + "failed: API is null.");
      } else a(c + "aborted: Connection already terminated.");
      return e;
    }),
    (n.SCORM.data.get = function (e) {
      var t = null,
        i = n.SCORM,
        s = n.UTILS.trace,
        a = i.debug,
        o = "SCORM.data.get(" + e + ") ";
      if (i.connection.isActive) {
        var r = i.API.getHandle(),
          c = 0;
        if (r) {
          switch (i.version) {
            case "1.2":
              t = r.LMSGetValue(e);
              break;
            case "2004":
              t = r.GetValue(e);
          }
          if (((c = a.getCode()), "" !== t || 0 === c))
            switch (e) {
              case "cmi.core.lesson_status":
              case "cmi.completion_status":
                i.data.completionStatus = t;
                break;
              case "cmi.core.exit":
              case "cmi.exit":
                i.data.exitStatus = t;
            }
          else
            s(
              o + "failed. \nError code: " + c + "\nError info: " + a.getInfo(c)
            );
        } else s(o + "failed: API is null.");
      } else s(o + "failed: API connection is inactive.");
      return s(o + " value: " + t), String(t);
    }),
    (n.SCORM.data.set = function (e, t) {
      var i = !1,
        s = n.SCORM,
        a = n.UTILS.trace,
        o = n.UTILS.StringToBoolean,
        r = s.debug,
        c = "SCORM.data.set(" + e + ") ";
      if (s.connection.isActive) {
        var l = s.API.getHandle();
        if (l) {
          switch (s.version) {
            case "1.2":
              i = o(l.LMSSetValue(e, t));
              break;
            case "2004":
              i = o(l.SetValue(e, t));
          }
          i
            ? ("cmi.core.lesson_status" !== e &&
                "cmi.completion_status" !== e) ||
              (s.data.completionStatus = t)
            : a(c + "failed. \nError code: 0. \nError info: " + r.getInfo(0));
        } else a(c + "failed: API is null.");
      } else a(c + "failed: API connection is inactive.");
      return a(c + " value: " + t), i;
    }),
    (n.SCORM.data.save = function () {
      var e = !1,
        t = n.SCORM,
        i = n.UTILS.trace,
        s = n.UTILS.StringToBoolean,
        a = "SCORM.data.save failed";
      if (t.connection.isActive) {
        var o = t.API.getHandle();
        if (o)
          switch (t.version) {
            case "1.2":
              e = s(o.LMSCommit(""));
              break;
            case "2004":
              e = s(o.Commit(""));
          }
        else i(a + ": API is null.");
      } else i(a + ": API connection is inactive.");
      return i("SCORM.data.save OK"), e;
    }),
    (n.SCORM.status = function (e, t) {
      var i = !1,
        s = n.SCORM,
        a = n.UTILS.trace,
        o = "SCORM.getStatus failed",
        r = "";
      if (null !== e) {
        switch (s.version) {
          case "1.2":
            r = "cmi.core.lesson_status";
            break;
          case "2004":
            r = "cmi.completion_status";
        }
        switch (e) {
          case "get":
            i = s.data.get(r);
            break;
          case "set":
            null !== t
              ? (i = s.data.set(r, t))
              : ((i = !1), a(o + ": status was not specified."));
            break;
          default:
            (i = !1), a(o + ": no valid action was specified.");
        }
      } else a(o + ": action was not specified.");
      return i;
    }),
    (n.SCORM.debug.getCode = function () {
      var e = n.SCORM,
        t = e.API.getHandle(),
        i = n.UTILS.trace,
        s = 0;
      if (t)
        switch (e.version) {
          case "1.2":
            s = parseInt(t.LMSGetLastError(), 10);
            break;
          case "2004":
            s = parseInt(t.GetLastError(), 10);
        }
      else i("SCORM.debug.getCode failed: API is null.");
      return s;
    }),
    (n.SCORM.debug.getInfo = function (e) {
      var t = n.SCORM,
        i = t.API.getHandle(),
        s = n.UTILS.trace,
        a = "";
      if (i)
        switch (t.version) {
          case "1.2":
            a = i.LMSGetErrorString(e.toString());
            break;
          case "2004":
            a = i.GetErrorString(e.toString());
        }
      else s("SCORM.debug.getInfo failed: API is null.");
      return String(a);
    }),
    (n.SCORM.debug.getDiagnosticInfo = function (e) {
      var t = n.SCORM,
        i = t.API.getHandle(),
        s = n.UTILS.trace,
        a = "";
      if (i)
        switch (t.version) {
          case "1.2":
            a = i.LMSGetDiagnostic(e);
            break;
          case "2004":
            a = i.GetDiagnostic(e);
        }
      else s("SCORM.debug.getDiagnosticInfo failed: API is null.");
      return String(a);
    }),
    (n.SCORM.init = n.SCORM.connection.initialize),
    (n.SCORM.get = n.SCORM.data.get),
    (n.SCORM.set = n.SCORM.data.set),
    (n.SCORM.save = n.SCORM.data.save),
    (n.SCORM.quit = n.SCORM.connection.terminate),
    (n.UTILS.StringToBoolean = function (e) {
      switch (typeof e) {
        case "object":
        case "string":
          return /(true|1)/i.test(e);
        case "number":
          return !!e;
        case "boolean":
          return e;
        case "undefined":
          return null;
        default:
          return !1;
      }
    }),
    (n.UTILS.trace = function (e) {
      n.debug.isActive &&
        window.console &&
        window.console.log &&
        console.log(e);
    }),
    (n.SCORM.SCOReportSessionTime = function () {
      var e = !1,
        t = new Date().getTime() - i.getTime();
      switch (this.version) {
        case "1.2":
          e = this.set(
            "cmi.core.session_time",
            (function (e) {
              var t = new Date();
              t.setTime(e);
              var i = "0" + Math.floor(e / 36e5),
                n = "0" + t.getMinutes(),
                s = "0" + t.getSeconds();
              return (
                i.substr(i.length - 2) +
                ":" +
                n.substr(n.length - 2) +
                ":" +
                s.substr(s.length - 2)
              );
            })(t)
          );
          break;
        case "2004":
          e = this.set(
            "cmi.session_time",
            (function (e) {
              var t = "P",
                i = (e = Math.max(e, 0)),
                n = Math.floor(i / 315576e4);
              i -= 315576e4 * n;
              var s = Math.floor(i / 26298e4);
              i -= 26298e4 * s;
              var a = Math.floor(i / 864e4);
              i -= 864e4 * a;
              var o = Math.floor(i / 36e4);
              i -= 36e4 * o;
              var r = Math.floor(i / 6e3);
              return (
                (i -= 6e3 * r),
                n > 0 && (t += n + "Y"),
                s > 0 && (t += s + "M"),
                a > 0 && (t += a + "D"),
                (o > 0 || r > 0 || i > 0) &&
                  ((t += "T"),
                  o > 0 && (t += o + "H"),
                  r > 0 && (t += r + "M"),
                  i > 0 && (t += i / 100 + "S")),
                "P" == t && (t = "PT0H0M0S"),
                t
              );
            })(Math.floor(t / 10))
          );
      }
      return e;
    }),
    (n.SCORM.data.scormSetInteraction = function (e) {
      const {
          id: t,
          type: i,
          response: s,
          weighting: a,
          result: o,
          pattern: r,
        } = e,
        c = n.SCORM.get("cmi.interactions._count");
      "1.2" == n.SCORM.version
        ? (n.SCORM.set("cmi.interactions." + c + ".id", t),
          n.SCORM.set("cmi.interactions." + c + ".type", i),
          n.SCORM.set("cmi.interactions." + c + ".result", o),
          n.SCORM.set("cmi.interactions." + c + ".student_response", s),
          n.SCORM.set("cmi.interactions." + c + ".weighting", a),
          n.SCORM.set(
            "cmi.interactions." + c + ".correct_responses.0.pattern",
            r
          ))
        : n.SCORM.set("cmi.comments", "ERROR: SET_INTERACTION SCORM FAILED");
    });
  const s = n,
    a = window.geniallyElearningPresetData.dataGeniallyOffline,
    o = a.Slides.filter((e) => !0 !== e.Hidden)
      .map((e) => e.Id)
      .reduce((e, t, i) => ((e[`${a.Genially.Id}|${t}`] = i), e), {}),
    r = new (class extends class extends class {
      constructor(e) {
        (this.DELIMITER = "|"),
          (this._pipwerks = e),
          window.addEventListener("unload", () => {
            this.end();
          }),
          window.addEventListener("beforeunload", () => {
            this.end();
          });
      }
      get pipwerks() {
        return this._pipwerks;
      }
      end() {
        this.pipwerks.SCORM.SCOReportSessionTime(), this.pipwerks.SCORM.quit();
      }
      start() {
        return (
          this.pipwerks.SCORM.init(),
          this.pipwerks.SCORM.data.set("cmi.core.score.min", 0),
          this.pipwerks.SCORM.data.set("cmi.core.score.max", 100),
          Promise.resolve(this.getLessonLocation())
        );
      }
    } {
      onSlideChanged(e, t, i, n) {
        const s = ((e) => {
            const t = new RegExp("\\|", "g");
            return e.replace(t, "");
          })(n),
          a = `${s.substr(0, 100)}|${e}|${t}|${i}`;
        this.pipwerks.SCORM.data.set("cmi.core.lesson_location", a);
      }
      setScore(e) {
        this.pipwerks.SCORM.data.set("cmi.core.score.raw", e);
      }
      getScore() {
        const e = parseFloat(
          this.pipwerks.SCORM.data.get("cmi.core.score.raw")
        );
        return isNaN(e) ? 0 : e;
      }
      setCompleted() {
        this.pipwerks.SCORM.data.set("cmi.core.lesson_status", "completed");
      }
      setLessonStatus(e) {
        this.pipwerks.SCORM.data.set("cmi.core.lesson_status", e);
      }
      getLessonLocation() {
        const e = (
          this.pipwerks.SCORM.data.get("cmi.core.lesson_location") || ""
        ).split(this.DELIMITER);
        return { backSlideId: e[3] || null, bookmark: e[2] || null };
      }
      getSuspendData() {
        return this.pipwerks.SCORM.data.get("cmi.suspend_data");
      }
    } {
      constructor(e, t, i, n) {
        super(e),
          (this._gradeToComplete = t),
          (this._totalSlides = i),
          (this._slidesDictionary = n),
          (this._locationData = new Set());
      }
      start() {
        const e = super.start();
        return (
          this.getSuspendData()
            .split(this.DELIMITER)
            .map((e) => parseInt(e))
            .filter((e) => !isNaN(e))
            .forEach((e) => {
              this._locationData.add(e);
            }),
          this.pipwerks.SCORM.data.save(),
          e
        );
      }
      onSlideChanged(e, t, i, n) {
        this.pipwerks.SCORM.data.save(), super.onSlideChanged(e, t, i, n);
        const s = `${e}${this.DELIMITER}${t}`,
          a = this._slidesDictionary[s];
        this._locationData.add(a);
        const o = Math.round(
          (100 * this._locationData.size) / this._totalSlides
        );
        this.setScore(o),
          this.pipwerks.SCORM.data.set(
            "cmi.suspend_data",
            this.serializedSuspendData
          ),
          o >= this._gradeToComplete && this.setCompleted(),
          this.pipwerks.SCORM.data.save();
      }
      get version() {
        return 0;
      }
      get serializedSuspendData() {
        return Array.from(this._locationData).join(this.DELIMITER);
      }
    })(
      s,
      window.geniallyElearningPresetData.gradeToComplete,
      Object.keys(o).length,
      o
    );
  window.geniallyElearningWrapper = Promise.resolve(r);
})();
