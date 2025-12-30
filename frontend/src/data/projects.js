export const projects = [
  {
    id: "badusb-project",
    title: "BadUSB Attack Device",
    category: "Hardware Exploitation",
    description:
      "BadUSB is a malicious USB device programmed to behave like a keyboard or mouse. Once connected, it can automatically execute commands, install backdoors, or steal credentials without user awareness.",

    highlights: [
      "USB masquerading as a Human Interface Device (HID)",
      "Automated keystroke injection",
      "Demonstrated real-world attack scenarios",
      "No software installation required on target",
    ],

    learning: [
      "Physical access equals full compromise",
      "Importance of USB device control policies",
      "Why unknown USBs should never be trusted",
    ],

    tools: ["BadUSB", "HID Attacks", "Physical Security"],

    images: ["/projects/badusb.jpg"],
  },

  {
    id: "keylogger",
    title: "Keylogger (Hardware & Software)",
    category: "Credential Theft",
    description:
      "This project demonstrated both hardware-based and software-based keyloggers, showing how attackers can silently capture keystrokes, credentials, and sensitive data.",

    highlights: [
      "Hardware HID keylogger demonstration",
      "Software keylogger running in background",
      "Captured dummy credentials safely",
      "Showed attacker misuse scenarios",
    ],

    learning: [
      "Why 2FA/MFA is critical",
      "Detecting suspicious background processes",
      "Risks of untrusted peripherals",
    ],

    tools: ["Keylogger", "HID Devices", "Endpoint Security"],

    images: ["/projects/keylogger.jpg"],
  },

  {
    id: "android-hacking",
    title: "Android Security Testing",
    category: "Mobile Security",
    description:
      "This project explored Android security weaknesses, including app data extraction and unsafe permissions, highlighting the risks of sideloaded applications.",

    highlights: [
      "Android app data extraction",
      "Unsafe permissions demonstration",
      "Test-device-only exploitation",
    ],

    learning: [
      "Importance of app source verification",
      "Mobile OS security fundamentals",
      "Keeping devices patched and updated",
    ],

    tools: ["Android Debug Bridge", "Mobile Forensics"],

    images: ["/projects/android.jpg"],
  },

  {
    id: "network-jammer",
    title: "Network Jammer",
    category: "Wireless Attacks",
    description:
      "A controlled demonstration of Wi-Fi jamming using ESP32 devices, showing how wireless communication can be disrupted by rogue hardware.",

    highlights: [
      "Wi-Fi signal disruption",
      "ESP32-based jammer setup",
      "Targeted device disconnections",
    ],

    learning: [
      "Wireless attacks are physical + logical",
      "Importance of strong encryption",
      "Monitoring rogue wireless devices",
    ],

    tools: ["ESP32", "Wi-Fi Protocols"],

    images: ["/projects/jammer.jpg"],
  },
];
