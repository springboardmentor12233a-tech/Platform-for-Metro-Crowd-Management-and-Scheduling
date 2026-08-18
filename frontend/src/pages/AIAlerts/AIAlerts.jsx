import { useEffect, useState } from "react";

import {
  getAlerts,
  createEmergencyAlert,
} from "../../api/alert";

import {
  AlertTriangle,
  X,
  Send,
  MapPin,
  MessageSquare,
  ShieldAlert,
  RefreshCw,
  Brain,
  UserRound,
} from "lucide-react";


export default function AIAlerts() {

  /* =========================================================
     ALERT STATE
  ========================================================= */

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] =
    useState(true);


  /* =========================================================
     EMERGENCY FORM
  ========================================================= */

  const [showEmergencyForm, setShowEmergencyForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [formError, setFormError] =
    useState("");


  const [emergencyForm, setEmergencyForm] =
    useState({

      severity: "🔴 Critical",

      station: "",

      alertType: "Security Emergency",

      message: "",

    });


  /* =========================================================
     LOAD ALERTS
  ========================================================= */

  useEffect(() => {

    loadAlerts();

  }, []);


  async function loadAlerts() {

    try {

      setLoading(true);

      const data = await getAlerts();

      setAlerts(data || []);

    } catch (err) {

      console.error(
        "Failed to load alerts:",
        err
      );

    } finally {

      setLoading(false);

    }

  }


  /* =========================================================
     COUNTERS
  ========================================================= */

  const critical = alerts.filter(
    (alert) =>
      alert.severity?.includes(
        "Critical"
      )
  ).length;


  const warning = alerts.filter(
    (alert) =>
      alert.severity?.includes(
        "Warning"
      )
  ).length;


  const normal = alerts.filter(
    (alert) =>
      alert.severity?.includes(
        "Normal"
      )
  ).length;


  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleEmergencyChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setEmergencyForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );


    setFormError("");

  };


  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeEmergencyForm = () => {

    if (submitting) {
      return;
    }


    setShowEmergencyForm(false);

    setFormError("");


    setEmergencyForm({

      severity: "🔴 Critical",

      station: "",

      alertType:
        "Security Emergency",

      message: "",

    });

  };


  /* =========================================================
     CREATE EMERGENCY ALERT
  ========================================================= */

  const handleEmergencySubmit =
    async (e) => {

      e.preventDefault();


      try {

        setSubmitting(true);

        setFormError("");


        const payload = {

          station:
            emergencyForm.station.trim(),

          message:
            emergencyForm.message.trim(),

          severity:
            emergencyForm.severity,

          alert_type:
            emergencyForm.alertType,

        };


        await createEmergencyAlert(
          payload
        );


        await loadAlerts();


        closeEmergencyForm();


      } catch (err) {

        console.error(
          "Emergency alert creation failed:",
          err
        );


        setFormError(
          err.response?.data?.detail ||
            "Unable to create emergency alert."
        );

      } finally {

        setSubmitting(false);

      }

    };


  return (

    <div className="min-h-screen bg-slate-100 p-8">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">

            🚨 AI Alert Center

          </h1>


          <p className="mt-2 text-sm text-slate-500">

            AI-powered monitoring and emergency
            operations management.

          </p>

        </div>


        <div className="flex items-center gap-3">


          {/* REFRESH */}

          <button
            type="button"
            onClick={loadAlerts}
            disabled={loading}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-indigo-600 disabled:opacity-50"
            title="Refresh alerts"
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

          </button>


          {/* EMERGENCY BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowEmergencyForm(true)
            }
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700"
          >

            <AlertTriangle
              size={19}
            />

            Create Emergency Alert

          </button>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="mb-8 grid gap-6 lg:grid-cols-3">


        {/* CRITICAL */}

        <div className="rounded-2xl bg-red-500 p-6 text-white shadow-lg">

          <p className="text-sm font-medium">
            Critical Alerts
          </p>


          <h2 className="mt-3 text-5xl font-bold">

            {critical}

          </h2>

        </div>


        {/* WARNING */}

        <div className="rounded-2xl bg-yellow-500 p-6 text-white shadow-lg">

          <p className="text-sm font-medium">
            Warning Alerts
          </p>


          <h2 className="mt-3 text-5xl font-bold">

            {warning}

          </h2>

        </div>


        {/* NORMAL */}

        <div className="rounded-2xl bg-green-500 p-6 text-white shadow-lg">

          <p className="text-sm font-medium">
            Normal Alerts
          </p>


          <h2 className="mt-3 text-5xl font-bold">

            {normal}

          </h2>

        </div>

      </div>


      {/* =====================================================
          ALERT LIST
      ===================================================== */}

      {loading ? (

        <div className="rounded-2xl bg-white p-10 text-center shadow-lg">

          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-indigo-600"
          />


          <p className="mt-3 text-slate-500">

            Loading alerts...

          </p>

        </div>

      ) : alerts.length === 0 ? (

        <div className="rounded-2xl bg-white p-10 text-center shadow-lg">

          <AlertTriangle
            size={35}
            className="mx-auto text-slate-300"
          />


          <h2 className="mt-4 text-xl font-semibold">

            No alerts found

          </h2>


          <p className="mt-2 text-sm text-slate-500">

            AI and emergency alerts will
            appear here.

          </p>

        </div>

      ) : (

        <div className="grid gap-6">


          {alerts.map(
            (alert, index) => {

              const isManual =
                alert.source ===
                "Manual Emergency";


              return (

                <div
                  key={
                    alert.id ??
                    `${alert.created_at}-${index}`
                  }
                  className={`rounded-2xl border bg-white p-6 shadow-lg transition hover:shadow-xl ${
                    isManual
                      ? "border-red-200"
                      : "border-slate-200"
                  }`}
                >


                  {/* =================================================
                      CARD HEADER
                  ================================================= */}

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                    <div className="flex items-center gap-3">


                      {/* ICON */}

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          isManual
                            ? "bg-red-100"
                            : "bg-indigo-100"
                        }`}
                      >

                        {isManual ? (

                          <UserRound
                            size={21}
                            className="text-red-600"
                          />

                        ) : (

                          <Brain
                            size={21}
                            className="text-indigo-600"
                          />

                        )}

                      </div>


                      {/* STATION */}

                      <div>

                        <h2 className="text-2xl font-bold text-slate-900">

                          {alert.station}

                        </h2>


                        <div className="mt-1 flex flex-wrap items-center gap-2">


                          {/* SOURCE BADGE */}

                          {isManual ? (

                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">

                              <AlertTriangle
                                size={12}
                              />

                              MANUAL EMERGENCY

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">

                              <Brain
                                size={12}
                              />

                              AI GENERATED

                            </span>

                          )}


                          {/* ALERT TYPE */}

                          {alert.alert_type && (

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">

                              {alert.alert_type}

                            </span>

                          )}

                        </div>

                      </div>

                    </div>


                    {/* SEVERITY */}

                    <div className="flex items-center gap-2">

                      <span className="text-xl">

                        {alert.severity}

                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      ALERT CONTENT
                  ================================================= */}

                  <div className="mt-6 grid gap-5 md:grid-cols-3">


                    {/* PASSENGERS */}

                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-sm text-slate-500">

                        Predicted Passengers

                      </p>


                      <h3 className="mt-1 text-3xl font-bold text-slate-900">

                        {alert.predicted_passengers ??
                          0}

                      </h3>

                    </div>


                    {/* RECOMMENDATION */}

                    <div className="rounded-xl bg-slate-50 p-4 md:col-span-1">

                      <p className="text-sm text-slate-500">

                        {isManual
                          ? "Emergency Details"
                          : "AI Recommendation"}

                      </p>


                      <p className="mt-2 font-medium leading-6 text-slate-800">

                        {alert.recommendation}

                      </p>

                    </div>


                    {/* TIME */}

                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-sm text-slate-500">

                        Time

                      </p>


                      <p className="mt-2 text-sm font-medium text-slate-700">

                        {new Date(
                          alert.created_at
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      MANUAL EMERGENCY NOTICE
                  ================================================= */}

                  {isManual && (

                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                      <ShieldAlert
                        size={18}
                        className="text-red-600"
                      />


                      <p className="text-sm font-medium text-red-700">

                        This alert was manually created
                        by an authorized MetroVision operator.

                      </p>

                    </div>

                  )}

                </div>

              );

            }

          )}

        </div>

      )}


      {/* =====================================================
          CREATE EMERGENCY MODAL
      ===================================================== */}

      {showEmergencyForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">


            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">

                  <ShieldAlert
                    size={23}
                    className="text-red-600"
                  />

                </div>


                <div>

                  <h2 className="text-xl font-bold text-slate-900">

                    Create Emergency Alert

                  </h2>


                  <p className="text-sm text-slate-500">

                    Manually notify the operations team.

                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={closeEmergencyForm}
                disabled={submitting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >

                <X size={20} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleEmergencySubmit}
              className="p-6"
            >


              {formError && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                  {formError}

                </div>

              )}


              <div className="grid gap-5 md:grid-cols-2">


                {/* SEVERITY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Severity

                  </label>


                  <select
                    name="severity"
                    value={
                      emergencyForm.severity
                    }
                    onChange={
                      handleEmergencyChange
                    }
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >

                    <option value="🔴 Critical">
                      🔴 Critical
                    </option>

                    <option value="🟡 Warning">
                      🟡 Warning
                    </option>

                    <option value="🟢 Normal">
                      🟢 Normal
                    </option>

                  </select>

                </div>


                {/* TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Emergency Type

                  </label>


                  <select
                    name="alertType"
                    value={
                      emergencyForm.alertType
                    }
                    onChange={
                      handleEmergencyChange
                    }
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >

                    <option value="Security Emergency">
                      Security Emergency
                    </option>

                    <option value="Medical Emergency">
                      Medical Emergency
                    </option>

                    <option value="Fire Emergency">
                      Fire Emergency
                    </option>

                    <option value="Train Breakdown">
                      Train Breakdown
                    </option>

                    <option value="Station Evacuation">
                      Station Evacuation
                    </option>

                    <option value="Crowd Surge">
                      Crowd Surge
                    </option>

                    <option value="Infrastructure Failure">
                      Infrastructure Failure
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* STATION */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Station / Location

                  </label>


                  <div className="relative">

                    <MapPin
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />


                    <input
                      type="text"
                      name="station"
                      value={
                        emergencyForm.station
                      }
                      onChange={
                        handleEmergencyChange
                      }
                      placeholder="e.g. New Delhi Metro Station"
                      required
                      disabled={submitting}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                </div>


                {/* MESSAGE */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Emergency Description

                  </label>


                  <div className="relative">

                    <MessageSquare
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />


                    <textarea
                      name="message"
                      value={
                        emergencyForm.message
                      }
                      onChange={
                        handleEmergencyChange
                      }
                      placeholder="Describe the emergency situation and required action..."
                      rows={5}
                      required
                      disabled={submitting}
                      className="w-full resize-none rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                </div>

              </div>


              {/* WARNING */}

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="flex gap-3">

                  <AlertTriangle
                    size={19}
                    className="mt-0.5 text-red-600"
                  />


                  <div>

                    <p className="text-sm font-semibold text-red-800">

                      Emergency Alert

                    </p>


                    <p className="mt-1 text-xs leading-5 text-red-700">

                      This alert will be stored in
                      the MetroVision alert system
                      and displayed to operations
                      personnel.

                    </p>

                  </div>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeEmergencyForm}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >

                  {submitting ? (

                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      Creating...

                    </>

                  ) : (

                    <>
                      <Send size={17} />

                      Create Emergency Alert
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}