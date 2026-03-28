const OpenJob = require("../models/OpenJob");
const Booking = require("../models/Booking");
const Worker = require("../models/Worker");

function genPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

exports.listOpenJobs = async (req, res) => {
  try {
    const jobs = await OpenJob.find({ status: "open" })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.acceptJob = async (req, res) => {
  try {
    const myWorker = await Worker.findOne({ userId: req.user._id });
    if (!myWorker) {
      return res
        .status(400)
        .json({ message: "Create your worker profile first" });
    }

    const job = await OpenJob.findById(req.params.id);
    if (!job || job.status !== "open") {
      return res.status(404).json({ message: "Job not available" });
    }

    job.status = "accepted";
    job.acceptedWorkerId = myWorker._id;

    const booking = await Booking.create({
      clientId: job.clientId,
      workerId: myWorker._id,
      status: "confirmed",
      servicePin: genPin(),
      serviceCategory: job.service || job.title,
      serviceType: job.title,
      notes: job.description,
      priceEstimate: job.price,
      address: "",
    });

    job.bookingId = booking._id;
    await job.save();

    const populated = await Booking.findById(booking._id)
      .populate("clientId", "firstName lastName email phone")
      .populate("workerId", "name profession rating")
      .lean();

    if (populated) delete populated.servicePin;

    res.json({ job, booking: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
