import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const existing = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'puzzles', 'index.json'), 'utf-8'));
const existingIds = new Set(existing.map(p => p.id));
const existingAnswers = new Set(existing.map(p => p.answer.toLowerCase()));

const newPuzzles = [
  // ============ HARDWARE (20 new = total 30) ============
  // Easy (7)
  {
    "id": "faulty-keyboard",
    "category": "Hardware",
    "difficulty": "Easy",
    "clues": [
      "User states the 'W', 'A', 'S', and 'D' keys on their keyboard do not produce any characters.",
      "All other keys on the keyboard work perfectly fine.",
      "The user confirms they spilled a small amount of soda on that exact area of the keyboard last week.",
      "The on-screen keyboard app works fine as a workaround.",
      "Plugging in a different USB keyboard resolves all issues."
    ],
    "answer": "faulty keyboard keys",
    "aliases": ["spilled key", "keyboard spill", "sticky keys", "keyboard not working", "dead keyboard keys", "broken keyboard"],
    "explanation": "The specific cluster of non-responsive keys coinciding with a known liquid spill strongly suggests conductive corrosion or stuck contacts under the affected key caps.",
    "fixSteps": [
      "Unplug the keyboard and place it upside down on a towel to drain any residual liquid",
      "Remove the affected key caps and clean the membrane contacts with 99% isopropyl alcohol",
      "If cleaning does not resolve, replace the entire keyboard"
    ]
  },
  {
    "id": "blown-speaker",
    "category": "Hardware",
    "difficulty": "Easy",
    "clues": [
      "User complains that audio from their laptop sounds tinny and distorted at any volume.",
      "Headphones plugged into the same headphone jack produce crystal clear audio.",
      "The sound is described as a 'buzzing' or 'rattling' quality on bass notes.",
      "The issue started after a particularly loud video conference call last week.",
      "External Bluetooth speakers connected to the laptop have no audio issues."
    ],
    "answer": "blown laptop speakers",
    "aliases": ["blown speaker", "distorted audio", "buzzing speaker", "crackling laptop audio", "faulty laptop speaker", "speaker damage"],
    "explanation": "Clear headphone and Bluetooth output but distorted internal audio indicates the physical speaker drivers have been mechanically overdriven or damaged (blown).",
    "fixSteps": [
      "Use headphones or external speakers as an immediate workaround",
      "In Windows Sound settings, ensure audio enhancements are disabled",
      "Replace the internal speaker assembly if the device is under warranty"
    ]
  },
  {
    "id": "dusty-gpu-fans",
    "category": "Hardware",
    "difficulty": "Easy",
    "clues": [
      "User reports their gaming PC shuts down after 10 minutes of playing any game.",
      "The graphics card temperature in MSI Afterburner reaches 92°C before shutdown.",
      "The GPU fans audibly spin up but then stop periodically during gaming.",
      "The user has not cleaned the inside of their computer case in over 2 years.",
      "Opening the side panel reveals a thick layer of dust caked on the GPU heatsink fins."
    ],
    "answer": "dust-clogged GPU cooler",
    "aliases": ["gpu overheating", "dusty gpu", "gpu fan not spinning", "clogged heatsink", "graphics card overheating"],
    "explanation": "Dust accumulation on the GPU heatsink thermally insulates the fins and prevents proper airflow, causing the graphics card to hit thermal limit and trigger emergency shutdown.",
    "fixSteps": [
      "Power down and ground yourself before opening the case",
      "Use compressed air to thoroughly clean the GPU heatsink fins and fan blades",
      "Monitor temperatures afterward to confirm the issue is resolved"
    ]
  },
  {
    "id": "missing-standoffs",
    "category": "Hardware",
    "difficulty": "Easy",
    "clues": [
      "User built their own PC and it won't power on at all.",
      "The power supply fan spins briefly when the switch is turned on, then stops.",
      "The motherboard's diagnostic LEDs flash for a split second then go dark.",
      "The user admits this is their first PC build and they 'winged it'.",
      "The motherboard is sitting directly on the metal case panel without any raised mounts underneath."
    ],
    "answer": "missing motherboard standoffs",
    "aliases": ["no standoffs", "short circuit", "motherboard shorting", "pc won't post new build", "case short"],
    "explanation": "Without standoffs, the motherboard's solder points contact the metal case directly, creating a short circuit that triggers the power supply's over-current protection (OCP) almost instantly.",
    "fixSteps": [
      "Remove the motherboard from the case entirely",
      "Install the brass standoffs in the correct ATX mounting holes on the case tray",
      "Reinstall the motherboard so it sits elevated above the case metal"
    ]
  },
  {
    "id": "bad-power-cable",
    "category": "Hardware",
    "difficulty": "Easy",
    "clues": [
      "An all-in-one desktop monitor intermittently loses power and goes black.",
      "Wiggling the power cable near the power brick connection makes the screen flicker.",
      "The power adapter's LED indicator goes off when the screen goes black.",
      "The monitor works fine when plugged into a different power outlet in the office.",
      "A known-good power cable from another monitor does not exhibit this behavior."
    ],
    "answer": "faulty power cable",
    "aliases": ["bad power cord", "frayed cable", "intermittent power", "loose power connector", "damaged power adapter cable"],
    "explanation": "An intermittent connection within the power cable (likely a broken conductor near the connector boot) causes the PSU to lose AC input when the cable is moved, which is classic for a cable that has been kinked or strained.",
    "fixSteps": [
      "Replace the standard IEC C13 power cable with a known-good spare",
      "If the cable is integrated, replace the entire power brick assembly",
      "Route the new cable to avoid sharp bends or being pinched by furniture"
    ]
  },
  {
    "id": "dead-usb-port",
    "category": "Hardware",
    "difficulty": "Easy",
    "clues": [
      "User's external mouse and keyboard stopped working simultaneously.",
      "Both devices are plugged into the front USB ports of the PC case.",
      "The rear USB ports on the motherboard work perfectly with the same devices.",
      "Windows plays the 'device disconnect' sound repeatedly every few seconds.",
      "In Device Manager, a yellow triangle appears on 'Unknown USB Device (Port Reset Failed)'."
    ],
    "answer": "dead front USB ports",
    "aliases": ["front io not working", "usb port failed", "front panel usb broken", "usb port not recognized", "case usb failure"],
    "explanation": "Front USB ports fail when the internal header cable becomes loose, is pinched, or when the cheap header pins on the motherboard crack. The constant disconnect sound indicates electrical instability.",
    "fixSteps": [
      "Check the internal USB 2.0/3.0 header connection on the motherboard for looseness",
      "Inspect the front panel header cable for visible damage (pinched or cut wires)",
      "If the header is damaged, use a PCIe USB expansion card as a permanent solution"
    ]
  },
  {
    "id": "ups-backup-failed",
    "category": "Hardware",
    "difficulty": "Easy",
    "clues": [
      "During a brief power flicker, the user's desktop PC shut down despite being plugged into a UPS.",
      "The UPS unit emits a continuous beeping sound and will not power on.",
      "Pressing the 'Test' button on the UPS produces no audible click or fan spin.",
      "The UPS is 5 years old and has been through many power outages.",
      "Opening the battery compartment reveals visible corrosion and swelling around the battery terminals."
    ],
    "answer": "dead UPS battery",
    "aliases": ["ups battery dead", "bad ups", "ups not working", "ups battery failed", "swollen ups battery"],
    "explanation": "A UPS that powers equipment from AC line-in but fails during outage has lost its DC battery capacity. Swollen, corroded terminals confirm the lead-acid battery has expired (typical 3-5 year lifespan).",
    "fixSteps": [
      "Immediately unplug the UPS from AC power and the PC",
      "Replace the internal battery with the manufacturer's specified replacement part number",
      "Perform a runtime calibration test after the new battery is installed"
    ]
  },
  // Medium (8)
  {
    "id": "no-poste-beeps",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "Desktop PC powers on with fans spinning and lights on, but no display output.",
      "There are zero POST beeps from the internal speaker, even though one is connected.",
      "The keyboard and mouse LEDs do not light up during boot.",
      "Reseating the RAM and GPU does not change anything.",
      "The system will only boot if a single RAM stick is installed in the second slot."
    ],
    "answer": "faulty memory channel",
    "aliases": ["dead ram slot", "bad memory channel", "ram slot not working", "motherboard dimm slot failure", "dual channel failure"],
    "explanation": "Zero POST beeps and no peripheral initialization when both RAM sticks are installed, but booting with one stick in a specific slot, indicates one memory channel on the CPU or motherboard has physically failed.",
    "fixSteps": [
      "Test each RAM slot individually with a known-good stick to confirm which channel is dead",
      "Update the motherboard BIOS in case it's a memory compatibility issue",
      "If confirmed, operate in single-channel mode or replace the motherboard"
    ]
  },
  {
    "id": "bad-sata-cable",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "The user's secondary storage drive randomly disappears from File Explorer.",
      "The drive re-appears after a full system shutdown and cold boot.",
      "Disk Management shows the drive as 'Unknown, Not Initialized' when it disappears.",
      "SMART diagnostics on the drive itself report no errors or bad sectors.",
      "Bumping the desk slightly causes the drive to immediately disconnect."
    ],
    "answer": "faulty SATA cable",
    "aliases": ["bad sata cable", "loose sata", "drive dropping out", "sata connection issue", "data cable failure"],
    "explanation": "A failing SATA data cable with loose or corroded pins causes intermittent connectivity. The drive drops from the SATA bus and the OS treats it as a removed device, restoring only after a full bus re-enumeration on cold boot.",
    "fixSteps": [
      "Power down the PC and reseat both ends of the SATA data cable firmly",
      "If the issue persists, replace the SATA cable entirely with a known-good cable",
      "Consider using a locking-latch SATA cable for a more secure connection"
    ]
  },
  {
    "id": "gpu-artifact-glitch",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "User reports random colored squares and lines appearing on their screen during any 3D application.",
      "The artifacts are still visible in the BIOS screen and Windows boot logo.",
      "Temperatures for the graphics card remain under 70°C.",
      "Reinstalling graphics drivers and rolling back to older versions does not help.",
      "The GPU has been overclocked with a custom voltage curve for the past year."
    ],
    "answer": "GPU memory degradation",
    "aliases": ["gpu artifacting", "vram failure", "gpu dying", "graphics corruption", "video memory corruption"],
    "explanation": "Artifacts visible even in POST screen and unaffected by driver changes point squarely to physical VRAM failure. Overclocking accelerates memory chip degradation when voltage tolerances are exceeded over time.",
    "fixSteps": [
      "Reduce the GPU memory clock to stock or below-stock speeds to test for stability",
      "Run a VRAM stress test (e.g., OCCT VRAM test or MemTestCL) to identify failed memory chips",
      "If under warranty, RMA the graphics card; otherwise, consider underclocking as a temporary mitigation"
    ]
  },
  {
    "id": "failing-wifi-card",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "Laptop Wi-Fi drops connection every 10-15 minutes and requires a reboot to reconnect.",
      "The Wi-Fi adapter disappears from Device Manager when the issue occurs.",
      "Reinstalling drivers and resetting network settings does not resolve the problem.",
      "A USB Wi-Fi dongle works perfectly in the same location without any drops.",
      "The laptop model is known for having defective Intel 9560 Wi-Fi cards from that production batch."
    ],
    "answer": "failing Wi-Fi card",
    "aliases": ["bad wifi card", "wifi adapter disconnecting", "laptop wifi failure", "wifi module dead", "wlan card failing"],
    "explanation": "The Wi-Fi adapter vanishing from Device Manager is a hardware-level failure, not a driver issue. Known batch defects in integrated Wi-Fi modules cause them to thermally fail after short periods of operation.",
    "fixSteps": [
      "Open Device Manager and check if the Wi-Fi adapter appears when hidden devices are shown",
      "Replace the internal M.2 Wi-Fi card with a compatible replacement module",
      "If replacement is not possible, use a high-quality USB Wi-Fi adapter as a permanent solution"
    ]
  },
  {
    "id": "dead-pcie-slot",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "User installed a new graphics card but the computer won't detect it.",
      "The new GPU's fans spin, but there is no display output.",
      "Plugging the old GPU back into the same slot also fails to produce display output.",
      "The new GPU works perfectly in a different computer.",
      "Inspecting the PCIe slot reveals two bent pins inside the slot."
    ],
    "answer": "damaged PCIe slot",
    "aliases": ["bent pcie pins", "broken pcie slot", "gpu slot dead", "expansion slot failure", "motherboard pcie damaged"],
    "explanation": "Bent pins inside the PCIe slot prevent proper electrical contact between the motherboard and the expansion card. Physical damage usually occurs from uneven insertion force or improper card removal.",
    "fixSteps": [
      "Try the expansion card in a different PCIe slot on the same motherboard",
      "If a second x16 slot exists, use that permanently (may run at x8 speed, which is negligible for most GPUs)",
      "If no other slot is available, replace the motherboard"
    ]
  },
  {
    "id": "bad-nvme-drive",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "User reports their PC boots to a black screen with a blinking cursor after a forced shutdown.",
      "The drive is not listed in the BIOS boot priority menu at all.",
      "When the PC does manage to start, the drive appears as 'RAW' in Disk Management.",
      "The M.2 drive gets excessively hot to the touch even when idle.",
      "The error 'A device which does not exist was specified' appears in Event Viewer."
    ],
    "answer": "failed NVMe SSD",
    "aliases": ["dead nvme", "nvme failure", "m2 drive dead", "ssd not detected", "nvme not booting", "failed m2 ssd"],
    "explanation": "An NVMe drive appearing as RAW with overheating symptoms indicates the controller chip has failed. M.2 drives are particularly susceptible to thermal damage in poorly ventilated laptop chassis.",
    "fixSteps": [
      "Try reseating the M.2 drive in its slot to rule out connection issues",
      "Attempt data recovery by connecting it via an external NVMe enclosure to another PC",
      "Replace the failed SSD and restore from backup"
    ]
  },
  {
    "id": "laptop-hinge-broken",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "The laptop screen wobbles noticeably when the user types on the keyboard.",
      "A cracking sound is heard when opening or closing the laptop lid.",
      "Plastic shards have fallen out from around the screen hinge area.",
      "The bezel near the right hinge is visibly separated from the display panel.",
      "The display cable inside the hinge might be getting pinched because the screen flickers at certain angles."
    ],
    "answer": "broken laptop hinge",
    "aliases": ["hinge broken", "laptop hinge damage", "screen hinge failure", "cracked hinge mount", "loose laptop lid"],
    "explanation": "Laptop hinges are designed to be stiffer than the plastic chassis they mount into. Over time, the torque of the hinge cracks the mounting bracket in the lid or base, causing structural failure of the display assembly.",
    "fixSteps": [
      "Stop opening and closing the lid to prevent further damage to the display cable",
      "If under warranty, RMA the unit for hinge replacement",
      "Out of warranty: replace the entire lid assembly or use an external monitor permanently"
    ]
  },
  {
    "id": "ram-xmp-instability",
    "category": "Hardware",
    "difficulty": "Medium",
    "clues": [
      "User reports random Blue Screens of Death with error code 'MEMORY_MANAGEMENT' when gaming.",
      "The system is stable during web browsing and office work.",
      "The user enabled XMP (Extreme Memory Profile) in BIOS to run RAM at its rated 3600MHz speed.",
      "Setting the RAM speed back to default 2133MHz in BIOS makes the crashes go away.",
      "The motherboard QVL list does not include the user's specific RAM kit part number."
    ],
    "answer": "XMP memory instability",
    "aliases": ["xmp crashing", "ram overclock unstable", "docp failure", "memory profile crash", "xmp not stable"],
    "explanation": "XMP is technically an overclock, and not all kits are validated on all motherboards. Stressful loads like gaming trigger the instability when the memory controller cannot sustain the XMP-rated frequency.",
    "fixSteps": [
      "Reset the RAM to JEDEC default speeds (2133/2400MHz) for immediate stability",
      "Update the motherboard BIOS to the latest version which may improve memory compatibility",
      "Manually tune the RAM voltage (typically 1.35-1.4V) and timings instead of using XMP"
    ]
  },
  // Hard (5)
  {
    "id": "dead-capacitor",
    "category": "Hardware",
    "difficulty": "Hard",
    "clues": [
      "The user's desktop PC suddenly stopped working and will not power on at all.",
      "No fans spin, no LEDs light up, and no sound is heard when pressing the power button.",
      "The power supply unit has been tested and confirmed to be working with a paperclip test.",
      "Upon visual inspection of the motherboard, several small cylindrical components on top appear bulging with brown residue at the top.",
      "The motherboard is from a pre-built office PC that is over 7 years old."
    ],
    "answer": "blown motherboard capacitors",
    "aliases": ["bad capacitors", "blown caps", "capacitor plague", "bulging caps", "motherboard capacitor failure", "electrolyte leak"],
    "explanation": "Electrolytic capacitors on the motherboard degrade over time, especially in systems with poor cooling. Bulging tops and brown residue indicate the electrolyte has dried out or leaked, causing voltage rail ripple that the system cannot tolerate.",
    "fixSteps": [
      "Inspect all capacitors on the motherboard for visible bulging, leaking, or corrosion",
      "If qualified, replace the failed capacitors by desoldering and installing new ones of identical rating",
      "If not repairable, replace the entire motherboard with a compatible model"
    ]
  },
  {
    "id": "intermittent-power-reset",
    "category": "Hardware",
    "difficulty": "Hard",
    "clues": [
      "The desktop PC randomly resets itself during normal operation, not just under load.",
      "Event Viewer shows a critical error 'Kernel-Power 41' with no previous bugcheck.",
      "Replacing the power supply with an expensive new unit does not fix the issue.",
      "The reset happens at random intervals, sometimes every hour, sometimes every day.",
      "Replacing the power button header on the motherboard with a known-good power switch resolved the issue entirely."
    ],
    "answer": "faulty power button",
    "aliases": ["bad power switch", "power button shorting", "front panel switch failure", "case button issue", "random shutdown power button"],
    "explanation": "A failing momentary power button switch can intermittently short the PWR_SW pins on the motherboard, telling the system to shut down or reset as if the user pressed the button. The Kernel-Power 41 without a bugcheck confirms a clean reset, not a crash.",
    "fixSteps": [
      "Disconnect the front panel PWR_SW header from the motherboard",
      "Use the motherboard's onboard power button (if available) or short the pins manually to test",
      "If confirmed, replace the faulty case switch or reconnect using the RESET_SW as a substitute"
    ]
  },
  {
    "id": "water-cooling-pump-dead",
    "category": "Hardware",
    "difficulty": "Hard",
    "clues": [
      "CPU temperatures spike to 100°C within minutes of starting any application.",
      "The AIO liquid cooler radiator fans are spinning at maximum speed.",
      "The CPU cooler's pump header shows 0 RPM in the BIOS monitoring screen.",
      "The case is clean with no dust buildup on any cooler.",
      "Tapping the pump housing with a screwdriver handle temporarily lowers temperatures by a few degrees."
    ],
    "answer": "failed AIO pump",
    "aliases": ["dead water pump", "aio pump failure", "liquid cooler pump dead", "cpu pump not spinning", "water cooling pump stopped"],
    "explanation": "A pump RPM reading of zero combined with immediate thermal runaway confirms the pump motor has seized or the impeller has separated from the motor shaft. Tapping temporarily re-engages a stuck impeller, confirming the diagnosis.",
    "fixSteps": [
      "Verify the pump power cable is connected to the dedicated AIO_PUMP header on the motherboard",
      "If connected correctly and still 0 RPM, the pump motor is dead and the cooler must be replaced",
      "Install a replacement air cooler or AIO cooler immediately to prevent CPU damage"
    ]
  },
  {
    "id": "cracked-bga-gpu",
    "category": "Hardware",
    "difficulty": "Hard",
    "clues": [
      "Laptop works fine when cool but develops a garbled, multi-colored screen after 20-30 minutes of use.",
      "External monitor connected via HDMI shows the same artifacts.",
      "The video corruption persists even in the BIOS or Safe Mode.",
      "Applying slight pressure to the back center of the laptop makes the screen flicker momentarily.",
      "Baking the motherboard in an oven at 200°C for 8 minutes temporarily fixes the issue for a few weeks."
    ],
    "answer": "cracked BGA GPU solder balls",
    "aliases": ["bga reflow needed", "gpu solder balls cracked", "gpu reball", "laptop gpu failure", "graphics chip desoldered", "solder joint failure gpu"],
    "explanation": "Graphics corruption on both internal and external displays in a laptop points to the GPU package itself. BGA (Ball Grid Array) solder joints under the GPU chip crack from thermal cycling stress. The oven 'fix' reflows the solder enough for intermittent contact, proving the root cause.",
    "fixSteps": [
      "Confirm with a dedicated GPU stress test (e.g., FurMark) that the artifacts are GPU-specific",
      "Professional reballing or reflow of the GPU BGA is a temporary repair at best",
      "Permanent fix: replace the entire motherboard or retire the laptop"
    ]
  },
  {
    "id": "bad-fan-controller",
    "category": "Hardware",
    "difficulty": "Hard",
    "clues": [
      "All case fans in the desktop run at 100% speed constantly, regardless of CPU temperature.",
      "The fans never slow down even when the PC is idle at desktop with 30°C CPU temp.",
      "Replacing individual fans with new ones does not change the behavior.",
      "The motherboard BIOS fan control is set to 'Silent' mode.",
      "Connecting the fans directly to the power supply via a Molex adapter makes them run at a fixed low speed."
    ],
    "answer": "dead motherboard fan controller",
    "aliases": ["fan controller failure", "pwm not working", "chassis fan header dead", "motherboard pwm broken", "fans full speed always"],
    "explanation": "When PWM fan headers lose their control signal transistor, they default to 100% power (fail-safe). Fans running at max regardless of BIOS settings, combined with direct PSU connection fixing them, confirms the motherboard's PWM circuitry is damaged.",
    "fixSteps": [
      "Install a software-based fan controller like FanControl or SpeedFan to rule out BIOS issues",
      "If software cannot control the fans, install a hardware fan controller hub with PWM pass-through",
      "Replace the motherboard if all headers are defective"
    ]
  },

  // ============ NETWORK (20 new = total 27) ============
  // Easy (7)
  {
    "id": "slow-wi-fi-5ghz",
    "category": "Network",
    "difficulty": "Easy",
    "clues": [
      "User complains that their internet is very slow on their laptop but fast on their phone.",
      "The laptop shows it is connected to Wi-Fi with 'Full Bars' signal strength.",
      "Speeds on the laptop are under 5 Mbps while the phone gets 200 Mbps in the same spot.",
      "The laptop is connected to the 'Office_5G' SSID while the phone is on 'Office_2G'.",
      "Disabling the 5GHz band in the laptop's Wi-Fi adapter advanced settings and using 2.4GHz only resolves the problem."
    ],
    "answer": "5GHz Wi-Fi interference",
    "aliases": ["5ghz slow", "wifi 5ghz issue", "slow 5ghz band", "wifi interference", "5ghz range problem", "laptop wifi slow 5ghz"],
    "explanation": "5GHz Wi-Fi offers higher speeds but has poor wall penetration and is susceptible to interference. The laptop's antenna placement or driver power-saving settings may cause it to have weaker 5GHz reception than the phone.",
    "fixSteps": [
      "Have the laptop connect to the 2.4GHz SSID instead of 5GHz for better range and stability",
      "Update the Wi-Fi adapter driver from the manufacturer's website",
      "Check the Wi-Fi adapter power-saving setting and disable '802.11n/ac/ax power saving'"
    ]
  },
  {
    "id": "network-cable-faulty",
    "category": "Network",
    "difficulty": "Easy",
    "clues": [
      "User's wired connection randomly drops and reconnects every few minutes.",
      "The network icon in the system tray alternates between 'Connected' and 'Identifying'.",
      "The Ethernet port's link light flashes amber instead of being solid green.",
      "The same cable works fine when tested on a different device.",
      "Inspect the cable and find a visible kink where a desk chair wheel has repeatedly rolled over it."
    ],
    "answer": "damaged Ethernet cable",
    "aliases": ["broken ethernet", "faulty network cable", "crushed cat6", "ethernet cable pinched", "network cable damage"],
    "explanation": "The intermittent connectivity combined with a visible kink and amber link light (indicating CRC errors or speed fallback) points to internal wire breakage within the Ethernet cable from physical stress.",
    "fixSteps": [
      "Replace the damaged patch cable with a new Cat6 or Cat6a cable",
      "Route the new cable away from desk legs and chair paths using cable management clips",
      "Test the new cable with a continuity tester to confirm all 8 wires are intact"
    ]
  },
  {
    "id": "wrong-subnet",
    "category": "Network",
    "difficulty": "Easy",
    "clues": [
      "A new employee cannot access the internet or company file shares.",
      "Their IP address shows as 192.168.1.50 but everyone else in the office is on 10.10.10.x.",
      "The user can ping the IP address of their own default gateway (192.168.1.1).",
      "Running 'ipconfig /release' and '/renew' does not change their IP address.",
      "The network settings show a manually entered static IP address instead of 'Obtain automatically'."
    ],
    "answer": "wrong subnet configuration",
    "aliases": ["wrong subnet", "misconfigured static ip", "incorrect subnet mask", "static ip wrong subnet", "ip not in correct vlan"],
    "explanation": "A static IP that is on a completely different network (192.168.x.x vs 10.10.10.x) means the user cannot route to any resources outside their own misconfigured subnet. DHCP renewal won't overwrite a manual configuration.",
    "fixSteps": [
      "Open IPv4 settings in the network adapter properties",
      "Set the IP address to 'Obtain automatically' (DHCP) instead of manual",
      "Run 'ipconfig /renew' and verify the new IP is in the correct corporate range"
    ]
  },
  {
    "id": "proxy-configured",
    "category": "Network",
    "difficulty": "Easy",
    "clues": [
      "A user reports that all websites fail to load with 'Unable to connect to proxy server' errors.",
      "The error message mentions a specific IP:Port that the user does not recognize.",
      "A colleague sitting right next to them with the same setup has no internet issues.",
      "Googling the issue shows a note about 'Proxy settings may be stuck from an old network'.",
      "Disabling 'Automatically detect settings' and turning off the proxy in LAN settings resolves everything immediately."
    ],
    "answer": "stale proxy configuration",
    "aliases": ["proxy error", "wrong proxy settings", "stale proxy", "proxy server not responding", "lan proxy stuck"],
    "explanation": "A stale proxy configuration from a previous network environment (e.g., corporate proxy at a different office) causes the browser to try routing all traffic through a proxy server that no longer exists on the current network.",
    "fixSteps": [
      "Open Internet Options > Connections tab > LAN Settings",
      "Uncheck 'Use a proxy server for your LAN' and check 'Automatically detect settings'",
      "Clear the browser cache and test connectivity"
    ]
  },
  {
    "id": "poe-not-powering",
    "category": "Network",
    "difficulty": "Easy",
    "clues": [
      "A VoIP desk phone shows 'No Power' and the screen is blank.",
      "The blue Ethernet cable is plugged into the phone and into the wall jack.",
      "Plugging the same phone into a different wall jack in the conference room works perfectly.",
      "The wall jack in the cubicle has a solid green link light on the switch port.",
      "The switch port that serves this cubicle was recently disabled to 'save power' during a cleaning."
    ],
    "answer": "PoE port disabled",
    "aliases": ["poe not working", "switch port disabled", "power over ethernet off", "voip phone no power", "desk phone dead"],
    "explanation": "The phone working on another wall jack confirms the phone and cable are fine. A solid link light means data connectivity exists, but without PoE power from the switch, the phone cannot function. The switch port's PoE capability was likely administratively disabled.",
    "fixSteps": [
      "Log into the network switch management interface",
      "Verify the switchport status and PoE setting for that specific port",
      "Re-enable PoE on the port with 'power inline auto' or equivalent command"
    ]
  },
  {
    "id": "bad-network-profile",
    "category": "Network",
    "difficulty": "Easy",
    "clues": [
      "Windows displays 'No Internet Access' on the Wi-Fi icon, but other devices on the same network work fine.",
      "Websites load in the browser despite the 'No Internet' warning icon.",
      "Some apps like Microsoft Teams and Outlook refuse to connect.",
      "The network is labeled as 'Public' instead of 'Private' in network settings.",
      "Changing the network profile from Public to Private resolves all application connectivity issues."
    ],
    "answer": "incorrect network profile",
    "aliases": ["public network profile", "network profile wrong", "windows public network issue", "network discovery blocked", "private network needed"],
    "explanation": "Windows treats 'Public' networks as untrusted and blocks many types of traffic by default, including network discovery and certain app connections. Apps like Teams require a 'Private' network profile to function correctly.",
    "fixSteps": [
      "Open Windows Settings > Network & Internet > Wi-Fi",
      "Click on the connected network and change the profile from 'Public' to 'Private'",
      "If the option is grayed out, use PowerShell: Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private"
    ]
  },
  {
    "id": "internet-outage-area",
    "category": "Network",
    "difficulty": "Easy",
    "clues": [
      "All users in the office report complete loss of internet at the same time.",
      "Internal network resources like printers and file servers are still reachable.",
      "Pinging external sites like 8.8.8.8 returns 'Destination host unreachable' for everyone.",
      "The ISP modem shows a red 'LOS' (Loss of Signal) light flashing.",
      "Checking the ISP's status page confirms a known outage in the area affecting multiple businesses."
    ],
    "answer": "ISP area outage",
    "aliases": ["internet outage", "isp down", "no internet", "los light red", "fiber cut", "isp service disruption"],
    "explanation": "When internal resources are fully functional but the ISP modem shows a LOS light and the ISP confirms an area outage, the problem is entirely on the service provider's side of the demarcation point.",
    "fixSteps": [
      "Inform all users of the confirmed ISP outage with estimated restoration time from the ISP's status page",
      "If the business has a secondary WAN link (4G/5G failover), switch traffic to the backup connection",
      "Document the outage ticket number from the ISP for potential SLA credit claims"
    ]
  },
  // Medium (8)
  {
    "id": "mtu-mismatch",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "Users can browse websites and send small emails, but large file attachments fail to send.",
      "VPN connections establish successfully but drop after 2-3 minutes.",
      "FTP transfers to an external partner stall at exactly the same file size every time.",
      "Ping with default settings works, but 'ping -f -l 1500' fails with 'Packet needs to be fragmented'.",
      "The remote office connects to HQ via a VPN tunnel that has a known lower MTU due to IPSec overhead."
    ],
    "answer": "MTU mismatch",
    "aliases": ["mtu fragmentation", "packet fragmentation issue", "mtu size wrong", "mtu 1500 issue", "vpn mtu problem", "jumbo frame misconfig"],
    "explanation": "When the path MTU is smaller than 1500 bytes (common with IPSec VPNs adding 50-80 bytes of overhead), standard-sized packets must be fragmented. If the 'Don't Fragment' flag is set, the packets are dropped, causing a hard failure for large transfers.",
    "fixSteps": [
      "Use 'ping -f -l [size]' to determine the maximum unfragmented packet size along the path",
      "Set the VPN interface or router's MTU to the discovered value (typically 1400-1460 for IPSec)",
      "Alternatively, enable MSS clamping on the router to automatically adjust TCP segment sizes"
    ]
  },
  {
    "id": "dns-cache-poisoning",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "Users in the office are redirected to a completely wrong website when visiting the company portal.",
      "The wrong site looks identical to the real portal but has a slightly different URL.",
      "Other external websites resolve correctly to their proper IP addresses.",
      "Flushing the DNS cache on an affected PC temporarily resolves the issue for an hour.",
      "The company DNS server has DNSSEC validation disabled."
    ],
    "answer": "DNS cache poisoning",
    "aliases": ["dns spoofing", "dns cache corruption", "fake dns entry", "dns hijack", "dns manipulation", "poisoned dns cache"],
    "explanation": "DNS cache poisoning occurs when a malicious actor injects forged DNS records into a DNS resolver's cache. Without DNSSEC to validate responses, the resolver accepts and serves the fraudulent record until it times out.",
    "fixSteps": [
      "Flush the DNS cache on both the affected client (ipconfig /flushdns) and the internal DNS server",
      "Enable DNSSEC validation on the DNS server to cryptographically verify DNS responses",
      "Investigate the source of the injection by reviewing DNS logs for anomalous query responses"
    ]
  },
  {
    "id": "trunk-port-mismatch",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "A newly installed network switch in the accounting department is not communicating with the core switch.",
      "All ports on the new switch show 'Link up' LEDs, but no traffic passes between the floors.",
      "Devices connected to the new switch can reach each other but not the rest of the network.",
      "The uplink cable between the switches is properly seated and tested.",
      "The new switch's uplink port is configured as an access port in VLAN 1, but the core switch expects an 802.1Q trunk."
    ],
    "answer": "switch trunk port mismatch",
    "aliases": ["trunk misconfig", "vlan trunk mismatch", "switchport mode mismatch", "802.1q misconfig", "vlan tagging issue"],
    "explanation": "When one switch expects an 802.1Q trunk (tagged frames) and the other sends untagged access frames, the VLAN tags are either stripped or missing, causing the core switch to drop or misroute all traffic from the new switch.",
    "fixSteps": [
      "Log into the new switch's management interface",
      "Configure the uplink port with 'switchport mode trunk' and allow the required VLANs",
      "Verify end-to-end VLAN propagation using 'show vlan brief' and test inter-VLAN routing"
    ]
  },
  {
    "id": "wifi-channel-saturation",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "Internet is extremely slow every day between 12:00 PM and 1:00 PM.",
      "The Wi-Fi analyzer shows 15+ other networks broadcasting on the same channel (channel 6).",
      "At other times of the day, speeds are acceptable.",
      "The office has a cafeteria directly below the IT floor where most employees have lunch.",
      "Checking the access point shows a high rate of 'CRC errors' and 'Retry %' during peak times."
    ],
    "answer": "Wi-Fi channel congestion",
    "aliases": ["wifi congestion", "channel overcrowding", "crowded wifi channel", "co-channel interference", "wifi interference neighbors"],
    "explanation": "When the office shares a Wi-Fi channel with a dozen competing networks (especially at peak lunch hours when everyone is on their phones), packet collisions and retransmissions saturate the airtime, drastically reducing throughput.",
    "fixSteps": [
      "Use a Wi-Fi survey tool to identify the least congested channel in your area",
      "Change the access point's channel to a non-overlapping channel with fewer competing networks",
      "Enable auto-channel selection on the AP or WLAN controller to dynamically avoid congestion"
    ]
  },
  {
    "id": "switch-fan-dead-poe",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "A network switch in the IDF closet has stopped forwarding traffic to half the floor.",
      "The switch feels extremely hot to the touch on the top panel.",
      "Port LED status shows erratic blinking patterns instead of steady activity.",
      "The switch fan is completely silent compared to the other working switch next to it.",
      "Power cycling the switch restores function but only for 10-15 minutes before ports start dropping again."
    ],
    "answer": "switch overheating from fan failure",
    "aliases": ["switch fan dead", "network switch overheating", "switch thermal shutdown", "idf closet overheat", "switch too hot"],
    "explanation": "Without the cooling fan, the switch's internal temperature rises until the ASIC throttles or shuts down ports to prevent damage. The timeout pattern of 10-15 minutes matches the thermal curve to the critical threshold.",
    "fixSteps": [
      "Immediately power down the switch and check the airflow path for obstructions",
      "Attempt to clear debris from the fan or replace the fan module if serviceable",
      "If the fan is integrated and non-replaceable, position an external fan to cool the switch as an emergency measure"
    ]
  },
  {
    "id": "asymmetric-routing",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "Users report that some websites load partially while others time out completely.",
      "Traffic to a specific cloud application works one minute but fails the next.",
      "The firewall logs show 'TCP RST' packets being returned from the destination.",
      "A traceroute to the failing service shows different returning paths on repeat attempts.",
      "The network has dual internet connections (primary fiber + backup broadband) with policy-based routing."
    ],
    "answer": "asymmetric routing issue",
    "aliases": ["asymmetric route", "return path mismatch", "stateful firewall drop", "tcp reset asymmetric", "different route return"],
    "explanation": "Asymmetric routing occurs when traffic to a destination uses one path but the return traffic takes a different path. Stateful firewalls expect to see both directions on the same interface, and they drop the return packets arriving on the wrong interface.",
    "fixSteps": [
      "Perform a traceroute from both directions (internal and external) to map both paths",
      "Configure symmetric routing on all routers to ensure inbound and outbound traffic use the same path",
      "If symmetric routing is not possible, configure PBR (Policy-Based Routing) exceptions or disable stateful inspection for affected flows"
    ]
  },
  {
    "id": "dns-timeout",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "Users complain that web pages take 15-30 seconds to start loading.",
      "Once a website starts loading, it loads completely and quickly.",
      "Internal resources accessed by IP address load instantly.",
      "'nslookup google.com' takes 15 seconds to respond.",
      "The internal DNS server's forwarder is pointing to a DNS server that was decommissioned last month."
    ],
    "answer": "DNS forwarder timeout",
    "aliases": ["slow dns", "dns resolution slow", "dns timeout", "dns forwarder broken", "recursive query timeout"],
    "explanation": "When DNS forwarders point to a dead/inaccessible server, the resolver must wait for a full timeout before attempting the next forwarder or falling back to root hints. Each DNS query takes 15+ seconds while waiting for the timeout cascade.",
    "fixSteps": [
      "Open the DNS Manager console on the DNS server",
      "Remove the defunct forwarder entry and replace it with a valid public DNS like 8.8.8.8 or 1.1.1.1",
      "Clear the DNS server cache and test resolution speed"
    ]
  },
  {
    "id": "speed-duplex-mismatch",
    "category": "Network",
    "difficulty": "Medium",
    "clues": [
      "A server on the network is transferring data at less than 1 MB/s over a 1 Gbps link.",
      "The link status shows '1 Gbps' on both the switch and the server NIC.",
      "The switch port error counters show thousands of 'CRC errors' and 'Collisions'.",
      "The server NIC was manually set to '100 Mbps Full Duplex' by a previous admin.",
      "Setting both sides to 'Auto Negotiation' immediately resolves the performance issue."
    ],
    "answer": "speed duplex mismatch",
    "aliases": ["duplex mismatch", "half duplex full duplex conflict", "auto negotiation failed", "nic speed mismatch", "ethernet duplex issue"],
    "explanation": "A speed/duplex mismatch occurs when one side uses manual settings while the other uses auto-negotiation. Although the speed may match, the duplex can mismatch (one side Full, one side Half), causing massive CRC errors and collisions from the conflicting line discipline.",
    "fixSteps": [
      "Configure both the switch port and the server NIC to 'Auto Negotiation' for both speed and duplex",
      "If auto-negotiation must be disabled (e.g., legacy equipment), ensure speed AND duplex match exactly on both ends",
      "Verify with 'show interface' on the switch that no CRC or collision errors increment after the fix"
    ]
  },
  // Hard (5)
  {
    "id": "bgp-route-flapping",
    "category": "Network",
    "difficulty": "Hard",
    "clues": [
      "The company's external website is intermittently unreachable from outside the network.",
      "The BGP router log shows 'BGP Notification sent: Hold Timer Expired' repeatedly.",
      "'show ip bgp summary' shows the peering neighbor flapping up and down every 30-60 seconds.",
      "Pinging the ISP's BGP peer IP shows latency spikes between 5ms and 500ms.",
      "There is a faulty SFP+ optic module on the WAN link that shows 'CRC-ALIGN' errors."
    ],
    "answer": "BGP route flapping",
    "aliases": ["bgp flapping", "route flapping", "bgp peer reset", "bgp hold timer expired", "bgp instability", "wan flapping"],
    "explanation": "A faulty SFP module injecting CRC errors into the physical layer causes keepalive corruption between BGP peers. When the router misses enough hold-time keepalives, it tears down the BGP session, only to re-establish moments later when the link momentarily clears.",
    "fixSteps": [
      "Replace the faulty SFP+ fiber optic module on the WAN edge router",
      "Clear the BGP session with 'clear ip bgp *' after the replacement to force a fresh adjacency",
      "Set up BGP route dampening to limit the propagation of flapping prefixes to the rest of the network during future events"
    ]
  },
  {
    "id": "vlan-stp-blocking",
    "category": "Network",
    "difficulty": "Hard",
    "clues": [
      "All users in the sales department lost network connectivity after a new switch was added to their rack.",
      "The new switch's uplink port status shows 'alternate' or 'blocking'.",
      "Broadcast traffic across the sales VLAN has increased by 500%.",
      "The new switch was plugged into two separate wall jacks, both connected to the same core switch.",
      "Disconnecting one of the two uplink cables instantly restores connectivity to the sales team."
    ],
    "answer": "Spanning Tree Protocol blocking",
    "aliases": ["stp blocking", "spanning tree issue", "network loop blocked", "redundant link blocking", "stp topology change"],
    "explanation": "STP detected a physical loop when the new switch was connected via two paths to the same core switch. STP correctly blocked one port to break the loop, but the topology change forced a MAC address table flush across the VLAN, disrupting traffic.",
    "fixSteps": [
      "Identify and unplug the redundant cable creating the Layer 2 loop",
      "Verify the STP root bridge election and ensure the core switch holds the root role",
      "If redundancy is desired, configure PortFast and UplinkFast on access ports for faster convergence"
    ]
  },
  {
    "id": "vrf-leak",
    "category": "Network",
    "difficulty": "Hard",
    "clues": [
      "A guest Wi-Fi user was able to access an internal company file server that should be isolated.",
      "Both the guest VLAN (VLAN 999) and internal user VLAN (VLAN 10) are in different VRFs.",
      "A single static route on the gateway includes 'route-map BOTH_VRFs' that permits all.",
      "The guest wireless controller authenticates users but hands out IPs from the correct subnet.",
      "Security audit logs show traffic between the guest subnet and the internal server's private IP."
    ],
    "answer": "VRF route leak",
    "aliases": ["vrf leak", "vrf route misconfiguration", "guest network not isolated", "vlan hopping", "network segmentation failure"],
    "explanation": "Guest and internal VRFs are designed to keep traffic completely separate. A misconfigured route-map or a route redistribution statement that imports routes between VRFs breaks this isolation, allowing guest traffic to reach internal resources.",
    "fixSteps": [
      "Remove any route-leaking configuration between the guest VRF and internal VRF on the gateway router",
      "Verify the guest VRF's routing table ('show ip route vrf GUEST') contains only a default route",
      "Add an explicit 'deny all' ACL between VRFs and test from a guest client"
    ]
  },
  {
    "id": "switch-mac-table-full",
    "category": "Network",
    "difficulty": "Hard",
    "clues": [
      "Users on a specific access switch report intermittent connectivity to the file server.",
      "The file server is on a different floor but in the same VLAN.",
      "'show mac address-table count' shows the switch has reached 100% of its MAC table capacity.",
      "The network team recently merged two large VLANs into one flat broadcast domain.",
      "The switch is an older 48-port model with only 8K MAC address entries supported."
    ],
    "answer": "MAC address table exhaustion",
    "aliases": ["mac table full", "switch cam table full", "mac flooding", "content addressable memory full", "switch forwarding table full"],
    "explanation": "When the switch's MAC table fills up, it cannot learn new MAC addresses and falls back to flooding unknown unicast traffic to all ports (like a hub). This causes bandwidth contention and increased collisions for all connected users.",
    "fixSteps": [
      "Review the MAC address table for signs of a MAC flooding attack or legitimate scaling issue",
      "Break the flat VLAN into multiple smaller VLANs with inter-VLAN routing to reduce the scale of each broadcast domain",
      "Replace the switch with a model that supports a larger MAC table (e.g., 32K or higher)"
    ]
  },
  {
    "id": "ospf-neighbor-stuck",
    "category": "Network",
    "difficulty": "Hard",
    "clues": [
      "A new router was installed in the branch office but isn't learning routes from the main office.",
      "'show ip ospf neighbor' shows the neighbor state stuck at 'EXSTART/EXCHANGE'.",
      "The link between the routers is up and both interfaces have IP addresses in the same subnet.",
      "The MTU on the branch router's interface is set to 1500 but the main office uses 9000 (jumbo frames).",
      "Setting the branch router's MTU to 9000 immediately establishes the OSPF adjacency."
    ],
    "answer": "OSPF MTU mismatch",
    "aliases": ["ospf neighbor stuck exchange", "ospf mtu issue", "ospf adjacency stuck in exstart", "ospf database exchange stuck", "routing protocol mtu"],
    "explanation": "OSPF uses the MTU value in its Database Description (DBD) packets during the EXSTART state. When routers have mismatched MTUs, they reject DBDs that exceed their MTU, causing the adjacency to stall at EXSTART/EXCHANGE and never reach FULL state.",
    "fixSteps": [
      "Match the MTU setting on both router interfaces (either both 1500 or both the jumbo frame size)",
      "Alternatively, use 'ip ospf mtu-ignore' on one side to bypass the MTU check (not recommended for production)",
      "Verify the adjacency now reaches FULL state with 'show ip ospf neighbor'"
    ]
  },

  // ============ SECURITY (20 new = total 27) ============
  // Easy (7)
  {
    "id": "weak-wifi-password",
    "category": "Security",
    "difficulty": "Easy",
    "clues": [
      "Users in the building are seeing an unknown person sitting in the parking lot on their laptops.",
      "The Wi-Fi network name 'Office_WiFi' appears in the 'Available Networks' list for anyone nearby.",
      "The current Wi-Fi password is 'password123' and has not been changed in 3 years.",
      "The network logs show authentication attempts from unknown MAC addresses at 2:00 AM daily.",
      "The wireless access point manages 50+ connected clients even though only 30 employees are in the office."
    ],
    "answer": "weak Wi-Fi security",
    "aliases": ["weak wifi password", "unauthorized wifi access", "wifi password too simple", "war driving", "wardriving attack", "open wifi security"],
    "explanation": "A simple, unchanged password allows unauthorized individuals easy access to the network. The extra clients and parking lot activity confirm an external actor is piggybacking on the office Wi-Fi for free internet or malicious activities.",
    "fixSteps": [
      "Change the Wi-Fi passphrase immediately to a complex 16+ character string with mixed case, numbers, and symbols",
      "Enable WPA3 security if the access point supports it, or WPA2-AES as a minimum",
      "Consider implementing 802.1X authentication with enterprise credentials for stronger access control"
    ]
  },
  {
    "id": "unlocked-workstation",
    "category": "Security",
    "difficulty": "Easy",
    "clues": [
      "A security walkthrough discovers a desk with an unlocked computer and the user is not at their desk.",
      "The user's email inbox is open on the screen with sensitive financial documents displayed.",
      "The user has a sticky note on their monitor with their password written on it.",
      "The company security policy explicitly requires all workstations to be locked when unattended.",
      "The computer has administrative privileges installed without proper authorization."
    ],
    "answer": "unsecured workstation",
    "aliases": ["unlocked pc", "unattended computer", "desk security violation", "password on sticky note", "tailgating risk", "physical security breach"],
    "explanation": "An unlocked workstation with visible credentials and sensitive data open represents both a physical security and data breach risk. Any passerby could access the system, read/spread sensitive documents, or install malware using the logged-in session.",
    "fixSteps": [
      "Lock the workstation immediately using Win+L",
      "Escalate the incident per company security policy for disciplinary review",
      "Implement screen lock group policy that auto-locks after 5 minutes of inactivity"
    ]
  },
  {
    "id": "public-file-share",
    "category": "Security",
    "difficulty": "Easy",
    "clues": [
      "A sensitive financial spreadsheet was found indexed by Google when searching the company name.",
      "The file path in the search result shows it was on a public-facing web server directory.",
      "The document contains employee salary information and Social Security numbers.",
      "The IT admin confirms there is no authentication on the /docs/ directory of the corporate website.",
      "The web server access logs show multiple automated bots downloading files from that directory."
    ],
    "answer": "publicly accessible file share",
    "aliases": ["open directory", "no authentication share", "public share", "unsecured file server", "information disclosure", "data exposure"],
    "explanation": "A web directory without any authentication barrier allows anyone on the internet to browse, download, and index sensitive files. Search engine crawlers discovering and indexing the documents means the data has been exposed to the public for some time.",
    "fixSteps": [
      "Immediately move the files to a secure location behind authentication",
      "Add a robots.txt disallow rule and request removal of the indexed content from Google Search Console",
      "Audit all web-accessible directories for proper access controls and consider using a web application firewall"
    ]
  },
  {
    "id": "usb-auto-run",
    "category": "Security",
    "difficulty": "Easy",
    "clues": [
      "An employee found a USB flash drive in the parking lot and plugged it into their work laptop.",
      "Windows AutoPlay popped up showing 'Install or run program from your media'.",
      "The laptop immediately started showing unusual pop-up ads and redirected web searches.",
      "The antivirus software is disabled and cannot be restarted.",
      "The USB drive contained a file named 'Company_Bonus_2026.xlsm.exe'."
    ],
    "answer": "USB drop attack",
    "aliases": ["usb baiting", "autorun malware", "USB thumb drive virus", "drop attack", "badusb", "physical social engineering attack"],
    "explanation": "A USB drop attack is a social engineering tactic where malware-laden drives are left in accessible locations, exploiting human curiosity. AutoPlay executes the disguised executable, immediately compromising the system with malware.",
    "fixSteps": [
      "Isolate the affected machine from the network immediately to contain the infection",
      "Disable AutoPlay/Autorun via Group Policy across the entire organization",
      "Run a full offline antivirus scan and rebuild the machine if infection persists"
    ]
  },
  {
    "id": "default-router-credentials",
    "category": "Security",
    "difficulty": "Easy",
    "clues": [
      "The company's main router was replaced by a temp worker yesterday.",
      "The router's admin panel is accessible from any device on the network at 192.168.0.1.",
      "The login page accepts 'admin' as both username and password.",
      "The previous router had a complex 20-character admin password written down in the IT binder.",
      "The router's model number is a widely known consumer device with documented default credentials online."
    ],
    "answer": "default router credentials",
    "aliases": ["default password", "admin admin login", "router default creds", "factory settings password", "weak router admin", "unsecured router"],
    "explanation": "Leaving a router with factory default credentials means anyone on the internal network (or from the internet if exposed) can log into the admin panel and reconfigure routing, DNS, firewall rules, or install malicious firmware.",
    "fixSteps": [
      "Log into the router using the default credentials, then immediately change both username and password",
      "Disable remote web-based administration from the WAN/Internet side",
      "Add the router and its admin credentials to the company's password management system"
    ]
  },
  {
    "id": "outdated-antivirus",
    "category": "Security",
    "difficulty": "Easy",
    "clues": [
      "User reports their computer has been acting strangely with random pop-ups and slow performance.",
      "The installed antivirus program icon in the system tray has a red 'X' on it.",
      "Opening the antivirus shows 'Last update: 14 months ago' and 'Virus definitions: 0'.",
      "The antivirus subscription license expired last year and was never renewed.",
      "Windows Security Center is showing 'No antivirus detected' even though the software is installed."
    ],
    "answer": "expired antivirus protection",
    "aliases": ["antivirus expired", "no virus definitions", "outdated av", "security software outdated", "endpoint protection expired", "antivirus license expired"],
    "explanation": "An antivirus with expired definitions and no active license is effectively useless. It may report as 'installed' to the OS but cannot detect or block any modern threats, giving both the user and IT a false sense of security.",
    "fixSteps": [
      "Renew the antivirus license or migrate to a supported endpoint protection solution",
      "Force a full definition update and a complete system scan",
      "If the machine is heavily infected, back up data and re-image the OS"
    ]
  },
  {
    "id": "telnet-enabled",
    "category": "Security",
    "difficulty": "Easy",
    "clues": [
      "A network audit reveals that several older network switches are still managed via Telnet.",
      "The same audit shows SSH is configured but never used on those switches.",
      "Network traffic captures show system administrators' credentials being transmitted in plain text.",
      "The company's security policy explicitly mandates encrypted management protocols.",
      "The switches are remotely manageable from the corporate network and the MDF is not locked."
    ],
    "answer": "insecure management protocol",
    "aliases": ["telnet in use", "plaintext passwords", "unencrypted management", "no ssh", "telnet instead of ssh"],
    "explanation": "Telnet transmits all data (including login credentials) in plain text over the network. Anyone with a packet sniffer on the same subnet can capture admin usernames and passwords, compromising the entire network infrastructure.",
    "fixSteps": [
      "Disable Telnet on all switches and routers using 'no transport input telnet'",
      "Enable SSH with a properly configured crypto key and 'transport input ssh'",
      "Enforce SSH-only management via configuration management to prevent Telnet from being re-enabled"
    ]
  },
  // Medium (8)
  {
    "id": "unpatched-vulnerability",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "A critical security bulletin was released 3 months ago for the company's database server software.",
      "The database server is still running version 12.3, which has a known remote code execution vulnerability.",
      "Monthly patch management reports show the database server as 'Failed to patch' for three consecutive cycles.",
      "The server cannot be patched during business hours, and no maintenance window has been scheduled.",
      "A recent penetration test report flagged this server as 'High Risk' with an available exploit proof-of-concept."
    ],
    "answer": "unpatched vulnerability",
    "aliases": ["missing security patch", "unpatched server", "known vulnerability", "cve not patched", "patch management failure", "critical update missing"],
    "explanation": "An unpatched server with a publicly available exploit represents a ticking time bomb. The longer the gap between patch release and installation, the higher the chance that threat actors will exploit the well-documented vulnerability against the organization.",
    "fixSteps": [
      "Schedule an emergency maintenance window to apply the critical patch",
      "If immediate patching is not possible, deploy a virtual patch via the IDPS or WAF as a temporary mitigation",
      "Review the patch management process to ensure critical patches have expedited approval workflows"
    ]
  },
  {
    "id": "internal-phishing-test",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "The company's security team sent a simulated phishing email to all employees as a training test.",
      "The email claimed the recipient needed to 'Verify their payroll account' or bonuses would be delayed.",
      "60% of employees clicked the link in the email.",
      "25% of employees entered their corporate credentials on the fake login page.",
      "Three employees forwarded the email to their personal email addresses to 'check it from home'."
    ],
    "answer": "social engineering vulnerability",
    "aliases": ["phishing susceptibility", "employee security awareness gap", "high click rate", "simulated phishing fail", "security training needed"],
    "explanation": "High click-through and credential-entry rates on a simulated phishing test indicate a critical gap in security awareness. Employees lack the training to identify common social engineering signs like urgency, threats of loss, and credential harvesting lures.",
    "fixSteps": [
      "Mandate a security awareness training course for all employees who clicked the simulated phish",
      "Implement quarterly simulated phishing campaigns and track improvement over time",
      "Enforce Multi-Factor Authentication (MFA) to protect accounts even if credentials are phished"
    ]
  },
  {
    "id": "mfa-fatigue-attack",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "A user reports receiving dozens of 'Approve your sign-in' push notifications on their phone at 3:00 AM.",
      "The notifications all say 'Microsoft Authenticator - Approve sign-in from United States'.",
      "The user is in the UK and has never been to the US.",
      "The user finally approved one of the prompts just to 'make the notifications stop'.",
      "10 minutes later, the user's corporate email started sending spam to all contacts."
    ],
    "answer": "MFA fatigue attack",
    "aliases": ["mfa bombing", "mfa push spam", "approval fatigue", "mfa prompt flood", "authenticator spam", "mfa social engineering"],
    "explanation": "MFA fatigue is a technique where attackers bombard a user with authentication requests until they accept one out of annoyance or sleepiness. Once approved, the attacker gains immediate access to the account with a valid MFA session.",
    "fixSteps": [
      "Immediately revoke the fraudulent session and force a password reset on the compromised account",
      "Change the MFA method from 'Approve push notification' to 'Number matching' or TOTP codes",
      "Implement Conditional Access policies to block authentication attempts from unexpected geographic locations"
    ]
  },
  {
    "id": "certificate-authority-compromise",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "The company's internal certificate authority (CA) server has been issuing valid certificates for domains that don't belong to the company.",
      "The CA server's security logs show an unknown IP address connected to the certification authority management console.",
      "Several workstations have certificates issued by the internal CA that were never requested by any admin.",
      "The CA server has not received any security updates in 18 months.",
      "The Certificate Revocation List (CRL) contains no entries despite suspicious activity."
    ],
    "answer": "compromised certificate authority",
    "aliases": ["ca breach", "certificate authority hacked", "unauthorized certificate issuance", "misissued certificates", "internal pki breach"],
    "explanation": "A CA that issues certificates without authorized requests likely has its private key compromised or its management interface exposed. Attackers can use these trusted certificates for HTTPS interception, code signing, and authentication spoofing.",
    "fixSteps": [
      "Immediately shut down the CA server and revoke all certificates it has issued",
      "Rebuild the CA server from scratch on a fully patched, air-gapped system",
      "Notify all systems that trusted the old CA to install the new root certificate and consider certificate pinning for critical services"
    ]
  },
  {
    "id": "privilege-escalation",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "A standard helpdesk employee was able to reset a CEO's password without proper authorization.",
      "The helpdesk system normally restricts password resets to Tier 2+ support agents only.",
      "The employee discovered they could use a hidden API endpoint that their account should not have access to.",
      "The API endpoint does not have any authorization checks beyond the authentication token.",
      "The employee claims they were 'just testing' and did not actually change any passwords."
    ],
    "answer": "privilege escalation vulnerability",
    "aliases": ["api authorization bypass", "privilege escalation via api", "role escalation", "vertical privilege escalation", "insecure direct object reference", "broken access control"],
    "explanation": "A hidden API endpoint that authenticates but does not authorize individual actions allows any authenticated user to perform elevated operations. This is a classic broken access control vulnerability (OWASP Top 10).",
    "fixSteps": [
      "Immediately conduct an audit of all API endpoints for missing authorization checks",
      "Implement role-based access control (RBAC) on every API endpoint that performs privileged operations",
      "Review the helpdesk employee's account audit logs for any unauthorized actions taken"
    ]
  },
  {
    "id": "insider-data-exfiltration",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "The DLP system flagged an employee email containing an attachment with 5000 customer records.",
      "The employee emailed the file to their personal Gmail address marked as 'Work from home backup'.",
      "The employee is in the sales department and has been with the company for 6 months.",
      "In the last week, the same employee has downloaded 50x more data from the CRM than their peers.",
      "The employee submitted a resignation letter the day after the DLP alert."
    ],
    "answer": "insider data theft",
    "aliases": ["data exfiltration", "insider threat", "employee data theft", "ip theft", "customer data stolen", "malicious insider"],
    "explanation": "The combination of anomalous data download volume, sending work data to personal email, and an immediate resignation is a textbook pattern of insider data theft before departing the company.",
    "fixSteps": [
      "Immediately revoke the employee's access to all corporate systems and accounts",
      "Preserve forensic evidence by taking a bit-for-bit image of the employee's laptop",
      "Contact legal counsel to determine appropriate legal action and notify affected customers if required by regulation"
    ]
  },
  {
    "id": "unsecured-s3-bucket",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "A security researcher emailed the company about a publicly accessible cloud storage bucket containing internal data.",
      "The bucket contains database backups, application logs with user PII, and API keys.",
      "The bucket's permissions are set to 'Everyone: Read' without any restrictions.",
      "The bucket was created 6 months ago for a 'quick proof of concept' that was never properly decommissioned.",
      "CloudTrail logs show the bucket has been accessed from IPs in 15 different countries in the last month."
    ],
    "answer": "public cloud storage bucket",
    "aliases": ["unsecured s3 bucket", "open cloud storage", "public azure blob", "gcs bucket open", "data leak cloud", "misconfigured storage"],
    "explanation": "An S3 bucket (or equivalent) configured with public read access allows anyone on the internet to list and download its contents without authentication. The broad international access pattern confirms data has been exfiltrated.",
    "fixSteps": [
      "Immediately change the bucket's permissions to 'Private' and block all public access",
      "Rotate all API keys and secrets that were exposed in the bucket contents",
      "Notify affected individuals whose PII was exposed per data breach notification laws"
    ]
  },
  {
    "id": "pass-the-hash",
    "category": "Security",
    "difficulty": "Medium",
    "clues": [
      "A domain administrator account was used to log into a file server at 3:00 AM on a Sunday.",
      "The domain admin is on vacation in another country and was not working at that time.",
      "The logon type in Windows Security logs shows 'Type 3 (Network)' instead of 'Type 2 (Interactive)'.",
      "A helpdesk workstation in the same office was infected with malware last Friday.",
      "Mimikatz was detected on the infected helpdesk workstation during the forensic analysis."
    ],
    "answer": "pass-the-hash attack",
    "aliases": ["pthe hash", "nltm hash relay", "credential relay", "mimikatz attack", "hash theft lateral movement"],
    "explanation": "Pass-the-Hash allows an attacker who extracts the NTLM hash of an admin account (via Mimikatz) to authenticate to remote servers without knowing the plaintext password. Type 3 logons from a compromised workstation point directly to lateral movement using harvested hashes.",
    "fixSteps": [
      "Immediately reset the domain admin password and revoke all Kerberos tickets (klist purge)",
      "Conduct a full incident response sweep of the network to identify all compromised machines",
      "Implement Credential Guard, LSA protection, and restrict local admin privileges to prevent future hash extraction"
    ]
  },
  // Hard (5)
  {
    "id": "dll-hijacking",
    "category": "Security",
    "difficulty": "Hard",
    "clues": [
      "The company's proprietary accounting software crashes on launch with 'Entry Point Not Found' errors.",
      "The software has been working fine for years but recently after an IT update it stopped working.",
      "Reinstalling the application does not resolve the issue.",
      "The software loads a file called 'version.dll' from its install directory.",
      "A search shows that 'version.dll' does not normally ship with this software but was placed in the folder recently."
    ],
    "answer": "DLL hijacking",
    "aliases": ["dll side-loading", "binary planting", "dll preloading attack", "dll spoofing", "malicious dll"],
    "explanation": "DLL hijacking occurs when a malicious DLL is placed in an application's working directory. Windows searches the local directory before system paths, so the app loads the rogue DLL instead of the legitimate system DLL, granting the attacker code execution within the app's security context.",
    "fixSteps": [
      "Remove the suspicious DLL file immediately and preserve it for forensic analysis",
      "Scan the system thoroughly for other signs of compromise or persistence mechanisms",
      "Implement 'Safe DLL Search Mode' via Group Policy and audit file creation events in application directories"
    ]
  },
  {
    "id": "kerberos-golden-ticket",
    "category": "Security",
    "difficulty": "Hard",
    "clues": [
      "A user's account was used to access confidential HR documents despite the user being terminated 3 months ago.",
      "The terminated user's AD account was disabled and deleted immediately upon termination.",
      "Security logs show Kerberos authentication succeeded for this user even though the account is deleted.",
      "The authentication timestamp in the logs shows a ticket valid for 10 years into the future.",
      "A domain controller's KRBTGT account password hash was never changed since the domain was created."
    ],
    "answer": "Kerberos golden ticket attack",
    "aliases": ["golden ticket", "krbtgt compromised", "kerberos ticket forgery", "domain persistence", "krbtgt hash stolen"],
    "explanation": "A Golden Ticket attack forges Kerberos Ticket-Granting Tickets (TGTs) using the compromised KRBTGT account hash. This gives the attacker domain admin access indefinitely, even after the original account is deleted. Tickets with 10-year validity are a signature of forged tickets.",
    "fixSteps": [
      "Reset the KRBTGT account password TWICE (with a 24-hour wait between) to invalidate all existing Kerberos tickets",
      "Conduct a full domain-wide audit for unknown privileged accounts and persistence mechanisms",
      "Implement KRBTGT password rotation as a scheduled task (monthly rotation is recommended)"
    ]
  },
  {
    "id": "zero-day-exploit",
    "category": "Security",
    "difficulty": "Hard",
    "clues": [
      "Multiple servers in the data center began exhibiting high CPU usage and outbound connection attempts simultaneously.",
      "The servers all run the same version of a widely used web server software.",
      "No known vulnerability matches the current version number according to the CVE database (until today).",
      "The outbound connections are to IP addresses associated with a known advanced persistent threat (APT) group.",
      "The web server vendor released an emergency patch today with vague 'remote code execution' language in the release notes."
    ],
    "answer": "zero-day exploit",
    "aliases": ["0day", "unknown vulnerability", "targeted zero-day", "apt zero-day", "undisclosed exploit", "zero-day attack in progress"],
    "explanation": "Simultaneous compromise of multiple systems running the same software, coinciding with an emergency patch release, strongly indicates a zero-day vulnerability being actively exploited before a patch was available. The APT attribution suggests a targeted attack.",
    "fixSteps": [
      "Apply the emergency patch immediately to all affected systems after testing in an isolated environment",
      "Implement virtual patching via the WAF/IPS to block exploit attempts on systems that cannot be patched immediately",
      "Engage the vendor's incident response team and preserve forensic evidence for potential legal action"
    ]
  },
  {
    "id": "supply-chain-attack",
    "category": "Security",
    "difficulty": "Hard",
    "clues": [
      "The company's development pipeline auto-built a release that behaves unexpectedly in production.",
      "A library dependency in the project's package manager was updated 2 days ago with a 'minor version bump'.",
      "The library update added obfuscated code that connects to an IP address registered in a hostile nation-state.",
      "The maintainer account that pushed the library update had 2FA disabled.",
      "Comparing the library checksums shows the published package differs from the source code on GitHub."
    ],
    "answer": "supply chain attack",
    "aliases": ["dependency hijacking", "malicious package", "typosquatting package", "dependency confusion", "open source backdoor", "software supply chain compromise"],
    "explanation": "An attacker compromising a popular open-source package maintainer's account and injecting malicious code into a routine update is a classic software supply chain attack. The code-mismatch between source and published binary proves the build/distribution channel was tampered with.",
    "fixSteps": [
      "Pin all production dependencies to exact known-good versions and audit the full dependency tree",
      "Replace the malicious package version with the previous known-good version from a cached/mirrored source",
      "Implement dependency vulnerability scanning, package lockfiles, and verify package checksums in CI/CD"
    ]
  },
  {
    "id": "dns-tunneling",
    "category": "Security",
    "difficulty": "Hard",
    "clues": [
      "A user's workstation is beaconing to an external domain with an unusually high volume of DNS queries.",
      "The DNS queries contain long encoded subdomains like 'aGVsbG8ud29ybGQ=.exfil.example.com' (base64-encoded).",
      "The total data transferred via DNS queries in one day is over 200 MB, despite the user being at lunch.",
      "Corporate DNS logs show this pattern originated 3 days ago, coinciding with the user clicking a LinkedIn ad.",
      "Firewall logs show no direct outbound connections from this workstation, only DNS traffic."
    ],
    "answer": "DNS tunneling",
    "aliases": ["dns exfiltration", "dns data leak", "dns covert channel", "c2 over dns", "dns command and control", "dns beaconing"],
    "explanation": "DNS tunneling encodes data in DNS query subdomains to bypass traditional network defenses. Since DNS is almost always allowed through firewalls, attackers use it as a covert channel for C2 communication and data exfiltration. The base64-looking subdomain content is a dead giveaway.",
    "fixSteps": [
      "Block the malicious domain at the DNS level and isolate the affected workstation from the network",
      "Analyze the DNS logs to determine how much data was exfiltrated and what type of data was stolen",
      "Implement DNS threat intelligence filtering and restrict DNS resolution to known-good recursive resolvers only"
    ]
  },

  // ============ SOFTWARE (20 new = total 27) ============
  // Easy (7)
  {
    "id": "broken-file-association",
    "category": "Software",
    "difficulty": "Easy",
    "clues": [
      "User double-clicks a PDF file but it opens in Notepad with garbled text.",
      "All PDF icons on the desktop now show as a generic white page instead of the Adobe Reader icon.",
      "The user accidentally chose 'Always use this app to open .pdf files' when Windows asked.",
      "Right-clicking the file and selecting 'Open with' shows no PDF reader in the list.",
      "Reinstalling Adobe Acrobat Reader does not fix the file association."
    ],
    "answer": "broken file association",
    "aliases": ["wrong default program", "file association corrupted", "pdf opens in notepad", "file type association broken", "default app settings issue"],
    "explanation": "File associations tell Windows which program should open a given file extension. When a user selects a text editor as the default for a binary format like PDF, the raw bytes get displayed as text, which looks like garbage.",
    "fixSteps": [
      "Open Windows Settings > Apps > Default Apps",
      "Scroll to 'Choose defaults by file type' and set .pdf to Adobe Reader or similar",
      "If the application does not appear in the list, run a repair installation or use 'Open with > Choose another app > Always'"
    ]
  },
  {
    "id": "frozen-application",
    "category": "Software",
    "difficulty": "Easy",
    "clues": [
      "Microsoft Excel has a '(Not Responding)' label on the title bar and is completely unresponsive.",
      "The user cannot click any buttons, close the window, or interact with the spreadsheet.",
      "Task Manager shows Excel is using 'Not Responding' status but consuming 30% CPU.",
      "The user tried to open a 500MB CSV file by dragging and dropping it into an already-running Excel instance.",
      "Other applications on the computer are working perfectly fine."
    ],
    "answer": "crashed application",
    "aliases": ["frozen program", "not responding", "application hang", "unresponsive app", "excel crashed", "program locked up"],
    "explanation": "Loading an extremely large file into an already-running application instance can cause the app's UI thread to block while it parses the data. The process is still running (30% CPU) but cannot respond to Windows messages because it's busy processing.",
    "fixSteps": [
      "Open Task Manager with Ctrl+Shift+Esc and end the hung Excel process",
      "Reopen Excel and use 'Data > From Text/CSV' to import the CSV file instead of opening it directly",
      "Recommend the user split the large CSV file using Power Query or a text editor before importing"
    ]
  },
  {
    "id": "wrong-time-zone",
    "category": "Software",
    "difficulty": "Easy",
    "clues": [
      "User's calendar appointments are all showing up one hour late in Outlook.",
      "Microsoft Teams shows the user as 'Away' starting at 4:00 PM even though they work until 5:00 PM.",
      "The system clock in the taskbar is showing the correct time.",
      "The clock's time zone is set to 'Coordinated Universal Time' instead of the user's local time zone.",
      "Email timestamps on recently received messages are off by 8 hours."
    ],
    "answer": "incorrect time zone",
    "aliases": ["wrong timezone", "calendar off by hour", "time zone mismatch", "outlook wrong time", "teams showing wrong status time"],
    "explanation": "The displayed time may be correct if UTC happens to match the current hour, but all applications use the time zone offset to calculate correct local times. UTC has no DST adjustment, so appointments and status times drift relative to local working hours.",
    "fixSteps": [
      "Right-click the system clock in the taskbar and select 'Adjust date/time'",
      "Set 'Time zone' to the correct local time zone (not UTC)",
      "Ensure 'Set time zone automatically' is enabled and the system can sync with the time server"
    ]
  },
  {
    "id": "taskbar-not-working",
    "category": "Software",
    "difficulty": "Easy",
    "clues": [
      "User's Windows taskbar is completely unresponsive — clicking icons does nothing.",
      "The Start menu button also does not respond to clicks.",
      "Icons on the desktop still work and can be opened.",
      "The user can open Task Manager with Ctrl+Shift+Esc.",
      "Restarting 'Windows Explorer' in Task Manager temporarily fixes the issue for a few hours."
    ],
    "answer": "corrupted Windows Explorer",
    "aliases": ["taskbar frozen", "start menu broken", "windows explorer crash", "shell experience host crash", "explorer.exe not responding"],
    "explanation": "The Windows Explorer process (explorer.exe) is the shell that manages the taskbar, Start menu, and system tray. When it becomes corrupted or encounters a bad shell extension, the UI becomes unresponsive while the desktop (a separate process) still works.",
    "fixSteps": [
      "Kill and restart explorer.exe via Task Manager (File > Run new task > explorer.exe)",
      "Run 'sfc /scannow' in an elevated command prompt to check for system file corruption",
      "Use the Windows Start Menu Troubleshooter or perform an in-place repair upgrade"
    ]
  },
  {
    "id": "double-typed-characters",
    "category": "Software",
    "difficulty": "Easy",
    "clues": [
      "User reports that every key they press on their laptop types the character twice (e.g., 'hello' becomes 'hheelloo').",
      "The issue happens in every application — Word, Notepad, browser — not just one program.",
      "The Filter Keys and Sticky Keys accessibility features are both disabled.",
      "Connecting an external USB keyboard produces normal single-character input.",
      "The laptop keyboard's repeat rate and repeat delay settings in Control Panel are set to extreme values."
    ],
    "answer": "keyboard repeat rate issue",
    "aliases": ["double typing", "key repeat too fast", "stuck repeat rate", "keyboard repeat delay too short", "ghost typing", "keyboard chattering"],
    "explanation": "Windows keyboard properties control how long a key must be held before repeating (repeat delay) and how fast it repeats. An extremely short repeat delay combined with a fast repeat rate causes normal typing taps to trigger the repeat mechanism, producing double characters.",
    "fixSteps": [
      "Open Control Panel > Keyboard Properties",
      "Set 'Repeat delay' to Long and 'Repeat rate' to Slow",
      "Test typing in Notepad and adjust the sliders to a comfortable level"
    ]
  },
  {
    "id": "print-spooler-crashed",
    "category": "Software",
    "difficulty": "Easy",
    "clues": [
      "No one in the office can print to any printer from their Windows workstations.",
      "Sending a print job causes it to disappear from the queue immediately with no output.",
      "Opening the 'Services' panel shows 'Print Spooler' service status as 'Stopped'.",
      "An error event in Event Viewer shows 'Spoolsv.exe failed to start' with error code 0x800706b9.",
      "The print spooler has stopped randomly three times this week."
    ],
    "answer": "crashed print spooler",
    "aliases": ["print spooler stopped", "print spooler failed", "printing not working", "spoolsv.exe crash", "cannot print windows"],
    "explanation": "The Print Spooler service manages all print jobs sent from applications. When it crashes, all print queues go offline and jobs vanish. The recurring crashes suggest a corrupt print driver or a stuck print job is killing spoolsv.exe upon processing.",
    "fixSteps": [
      "Open Services.msc, right-click 'Print Spooler' and select 'Restart'",
      "If it crashes again, clear the spooler folder at C:\\Windows\\System32\\spool\\PRINTERS",
      "Identify and remove the corrupt print driver by testing printers one at a time"
    ]
  },
  {
    "id": "windows-search-not-working",
    "category": "Software",
    "difficulty": "Easy",
    "clues": [
      "User types in the Windows Search bar but nothing happens — no results appear.",
      "The search box cursor blinks but typing yields zero suggestions or matches.",
      "The search icon in the taskbar has a small downward arrow badge on it.",
      "Rebooting the computer does not resolve the issue.",
      "Running the 'Search and Indexing' troubleshooter reports 'Windows Search service is not running'."
    ],
    "answer": "Windows Search service stopped",
    "aliases": ["search not working", "windows search broken", "search indexer stopped", "cortana not responding", "start menu search broken"],
    "explanation": "Windows Search is a separate service (WSearch) that builds and maintains an index of files, apps, and settings. When the service stops, the search function becomes completely unresponsive because there is no indexer to query.",
    "fixSteps": [
      "Open Services.msc and locate 'Windows Search' service",
      "Set the startup type to 'Automatic' and click 'Start'",
      "If it fails to start, rebuild the search index via Indexing Options > Advanced > Rebuild"
    ]
  },
  // Medium (8)
  {
    "id": "corrupt-windows-store",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "User cannot install any apps from the Microsoft Store — downloads get stuck at 0%.",
      "The Store app itself crashes immediately upon launch with error code 0x80073D0A.",
      "Windows Update also fails with related errors.",
      "Resetting the Store app via Settings does not resolve the issue.",
      "Running the 'wsreset.exe' command from Run returns 'The system cannot find the path specified'."
    ],
    "answer": "corrupted Microsoft Store",
    "aliases": ["microsoft store broken", "store not working", "windows store crash", "appx corruption", "store cache corrupt", "store download stuck"],
    "explanation": "The Microsoft Store relies on the AppX deployment subsystem and a set of framework packages. When these become corrupted (commonly after a failed Windows update), the Store cannot initialize its download pipeline or even launch correctly.",
    "fixSteps": [
      "Run 'wsreset.exe' from an administrative command prompt to clear the store cache",
      "Use the Windows Update Troubleshooter to repair the update infrastructure",
      "As a last resort, run PowerShell commands 'Get-AppXPackage -AllUsers | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register \"$($_.InstallLocation)\\AppXManifest.xml\"}' to re-register all Store apps"
    ]
  },
  {
    "id": "sound-driver-failed",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "User has no audio output from their computer at all.",
      "The speaker icon in the system tray has a red 'X' on it.",
      "Device Manager shows 'Realtek High Definition Audio' with a yellow exclamation mark.",
      "The device status reads 'This device cannot start (Code 10)'.",
      "Windows Updates recently installed a driver update for the audio device."
    ],
    "answer": "failed audio driver",
    "aliases": ["no sound", "audio device not working", "realtek driver failed", "sound driver code 10", "audio driver crash", "speaker no audio"],
    "explanation": "A 'Code 10' error in Device Manager means the driver failed to start or communicate with the hardware. This often occurs after a Windows Update delivers an incompatible or buggy audio driver that doesn't match the specific audio codec on the motherboard.",
    "fixSteps": [
      "Open Device Manager and roll back the audio driver to the previous version",
      "If rollback is unavailable, uninstall the audio device (check 'Delete driver software') and reboot",
      "Download and install the audio driver directly from the motherboard manufacturer's support site, not via Windows Update"
    ]
  },
  {
    "id": "onedrive-sync-conflict",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "User reports error messages saying 'We can't sync your files' from OneDrive.",
      "The OneDrive icon in the system tray has a red 'X' badge.",
      "Files saved to the 'OneDrive - Company' folder do not appear on other devices.",
      "The user has 14 different versions of the same file named 'Budget 2026(1).xlsx' through 'Budget 2026(14).xlsx'.",
      "The OneDrive sync app shows 'Changes are being merged from another device' continuously."
    ],
    "answer": "OneDrive sync conflict",
    "aliases": ["onedrive stuck", "onedrive not syncing", "file sync conflict", "onedrive merge loop", "cloud sync broken", "onedrive error"],
    "explanation": "OneDrive sync conflicts occur when a file is being edited on multiple devices simultaneously or when sync is interrupted mid-write. The constant merge messages and proliferation of renamed copies indicate a stuck conflict resolution loop.",
    "fixSteps": [
      "Pause and resume OneDrive sync from the system tray icon to reset the sync engine",
      "Clear the OneDrive cache by running 'onedrive.exe /reset' from Run",
      "Identify the conflicting file(s), merge the changes manually, and delete the excess copies"
    ]
  },
  {
    "id": "startup-folder-malware",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "User's PC takes 10+ minutes to boot up to a usable desktop state.",
      "Task Manager shows 50+ startup programs enabled in the startup tab.",
      "Most of the startup entries have 'Publisher: Not verified' or are from unknown vendors.",
      "The user admits to downloading and installing 'free system cleaners' and 'optimizers' from internet ads.",
      "Several of the startup entries point to files in the C:\\Users\\[User]\\AppData\\Local\\Temp folder."
    ],
    "answer": "startup program bloat",
    "aliases": ["too many startup programs", "slow boot", "bloatware startup", "pc too slow to start", "pup infection", "potentially unwanted program"],
    "explanation": "Boot time increases dramatically when dozens of programs register to launch at startup, especially from temporary folders where 'optimizer' tools install. Many such programs are Potentially Unwanted Programs (PUPs) that add no value but consume resources on every boot.",
    "fixSteps": [
      "Open Task Manager > Startup and disable all startup entries from unknown/unofficial publishers",
      "Run a malware scan with Windows Defender Offline to remove PUPs and any bundled malware",
      "Use the 'Settings > Apps' menu to uninstall any suspicious freeware or system 'optimizer' tools"
    ]
  },
  {
    "id": "blue-screen-dpc-watchdog",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "User's PC Blue-Screens with 'DPC_WATCHDOG_VIOLATION' error when transferring files to an external SSD.",
      "The BSOD happens consistently whenever large files are copied to the USB-C connected drive.",
      "The external SSD works perfectly on another computer.",
      "The system has a specific USB controller driver from a lesser-known chipset vendor.",
      "Updating all drivers via Windows Update did not resolve the issue."
    ],
    "answer": "faulty USB controller driver",
    "aliases": ["dpc watchdog violation", "bsod usb transfer", "usb driver crash", "external drive bluescreen", "usb controller bug", "dpc watchdog bsod"],
    "explanation": "The DPC_WATCHDOG_VIOLATION bugcheck occurs when a driver component fails to complete operations within the expected Deferred Procedure Call (DPC) time limit. The bad USB controller driver hangs during high-throughput transfers, triggering the watchdog timeout.",
    "fixSteps": [
      "Download the latest chipset and USB controller drivers directly from the motherboard manufacturer's website",
      "If no updated driver exists, try using a different USB port (e.g., USB-A instead of USB-C, or a different controller hub)",
      "As a workaround, disable USB selective suspend in Power Options to prevent the controller from entering low-power states during transfers"
    ]
  },
  {
    "id": "certificate-expired-code-signing",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "A company-internal application shows a 'Windows protected your PC' SmartScreen warning on launch.",
      "The 'Publisher' field reads 'Unknown Publisher' even though IT developed the app.",
      "The application was previously trusted and ran without warnings.",
      "The certificate used to sign the internal application expired 2 weeks ago.",
      "Re-signing the application with the new certificate resolves the SmartScreen warning."
    ],
    "answer": "expired code signing certificate",
    "aliases": ["code signing expired", "smartscreen warning internal app", "unknown publisher app", "digital signature expired", "authenticode certificate expired"],
    "explanation": "Windows checks the certificate chain validity (including expiration) when evaluating SmartScreen trust for an application. An expired code signing certificate breaks the trust chain, causing Windows to treat the signed app as untrusted even if the code itself hasn't changed.",
    "fixSteps": [
      "Renew the code signing certificate and re-sign the application using signtool.exe",
      "Update the timestamp server URL in the signing process to include a valid RFC 3161 timestamp",
      "Distribute the updated signed application to all users and deploy the new certificate via Group Policy"
    ]
  },
  {
    "id": "excel-formula-not-calculating",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "User reports that Excel formulas are not updating when the source cell values change.",
      "The formula shows as-is in the cell instead of the computed result.",
      "The cell format is set to 'Text' instead of 'General'.",
      "The user copied the formula from an email and it was pasted with formatting.",
      "Changing the cell format to 'General' and pressing F2+Enter only fixes one cell at a time."
    ],
    "answer": "Excel calculation mode issue",
    "aliases": ["excel formulas not working", "formula showing not calculating", "excel manual calculation", "excel show formulas", "excel formula text format"],
    "explanation": "When a cell is formatted as 'Text', Excel treats the formula as a literal string rather than an executable formula. Additionally, if Excel's calculation mode is set to 'Manual', formulas will not auto-update when dependencies change.",
    "fixSteps": [
      "Select all affected cells and change the format from 'Text' to 'General' via the Home tab",
      "Press F2 then Enter to force recalculation of each cell, or use Find & Replace: replace '=' with '=' to trigger re-evaluation en masse",
      "Check Formulas > Calculation Options and ensure it is set to 'Automatic'"
    ]
  },
  {
    "id": "hosts-file-blocked",
    "category": "Software",
    "difficulty": "Medium",
    "clues": [
      "A specific website cannot be accessed from a single workstation, but loads fine on all other PCs.",
      "The error displayed is 'This site can't be reached' immediately (no loading delay).",
      "Pinging the website's domain returns an IP address that is not the correct public IP.",
      "The IP resolves to 127.0.0.1 (localhost) on the affected PC.",
      "Opening C:\\Windows\\System32\\drivers\\etc\\hosts reveals an entry blocking that domain."
    ],
    "answer": "malicious hosts file entry",
    "aliases": ["hosts file modified", "website blocked by hosts", "etc hosts redirect", "local dns hijack", "hosts file malware", "hosts file tampered"],
    "explanation": "The Windows hosts file takes priority over DNS resolution. A malicious or misconfigured entry redirecting a domain to 127.0.0.1 makes the site unreachable from only that PC. This is a common persistence technique used by malware to block security website access.",
    "fixSteps": [
      "Open C:\\Windows\\System32\\drivers\\etc\\hosts in Notepad as Administrator",
      "Review the file for any suspicious entries and remove lines that redirect the affected domain to 127.0.0.1 or 0.0.0.0",
      "Save the file and flush the DNS cache with 'ipconfig /flushdns', then run a full antivirus scan"
    ]
  },
  // Hard (5)
  {
    "id": "registry-corruption",
    "category": "Software",
    "difficulty": "Hard",
    "clues": [
      "User gets 'Application failed to initialize (0xc0000142)' when trying to launch any Microsoft Office application.",
      "The Event Viewer shows 'DCOM got error 1084 attempting to start the service Microsoft Office Click-to-Run'.",
      "Windows Registry Editor shows the CLSID key for Office applications is missing or contains garbled characters.",
      "Running System File Checker (sfc /scannow) reports 'Windows Resource Protection found corrupt files but could not fix them'.",
      "The user's PC was unexpectedly shut down during a power outage while Office was updating."
    ],
    "answer": "corrupted Windows registry",
    "aliases": ["registry hive corrupt", "dcom error 1084", "broken clsid", "application 0xc0000142", "windows registry damaged", "registry key missing"],
    "explanation": "The Windows registry stores CLSID (Class ID) entries that tell the OS how to launch applications. A power loss during an Office update can leave partially-written registry hives, breaking the COM activation chain that Office depends on for its licensing and activation services.",
    "fixSteps": [
      "Run System Restore to return the registry to a state before the outage",
      "Use DISM /Online /Cleanup-Image /RestoreHealth to repair the component store, then re-run sfc /scannow",
      "If registry repair fails, perform a repair installation of Microsoft Office from the official installer"
    ]
  },
  {
    "id": "bootmgr-missing",
    "category": "Software",
    "difficulty": "Hard",
    "clues": [
      "The PC displays 'Bootmgr is missing' on a black screen immediately after POST.",
      "No operating system selection menu appears despite having multiple drives.",
      "The BIOS correctly identifies all connected drives in the boot priority list.",
      "The boot drive appears in a Windows recovery USB when using diskpart to list volumes.",
      "The partitions on the boot drive are all intact but the 'System Reserved' partition appears empty."
    ],
    "answer": "corrupted boot configuration",
    "aliases": ["bootmgr missing", "boot configuration corrupt", "bcd error", "bootmgr is missing press ctrl alt del", "boot sector corruption", "efi boot broken"],
    "explanation": "Bootmgr missing means the Boot Configuration Data (BCD) store or the boot sector on the System Reserved partition has been corrupted. The data on the main partition is intact, but the bootloader cannot find the path to the Windows installation.",
    "fixSteps": [
      "Boot from a Windows installation USB and select 'Repair your computer'",
      "Open Command Prompt and use 'bootrec /fixmbr', 'bootrec /fixboot', and 'bootrec /rebuildbcd'",
      "If 'bootrec /fixboot' gives 'Access denied', use 'bootsect /nt60 SYS' from the recovery environment"
    ]
  },
  {
    "id": "dynamic-link-library-failure",
    "category": "Software",
    "difficulty": "Hard",
    "clues": [
      "User gets 'The program can't start because VCRUNTIME140.dll is missing from your computer' when launching a CAD application.",
      "The CAD application was freshly installed and should include all dependencies.",
      "Other applications that require Microsoft Visual C++ redistributables are also failing.",
      "Checking Add/Remove Programs shows 17 different versions of Visual C++ Redistributable installed.",
      "Running the Visual C++ repair installer fails with 'A different version of the product is already installed'."
    ],
    "answer": "Visual C++ redistributable corruption",
    "aliases": ["vcruntime140.dll missing", "msvcp140.dll not found", "visual c++ runtime error", "dll side-by-side error", "c++ redistributable problem"],
    "explanation": "Multiple overlapping or corrupted Visual C++ redistributable installations can cause DLL reference conflicts. The Windows side-by-side (WinSxS) assembly store may have broken manifests, preventing applications from finding the correct runtime DLL even though the files exist on disk.",
    "fixSteps": [
      "Uninstall ALL Visual C++ Redistributable packages via Add/Remove Programs",
      "Download and reinstall the latest Visual C++ Redistributable packages (2015-2022 x86 and x64) from Microsoft's official site",
      "If the issue persists, run 'sfc /scannow' and 'DISM /Online /Cleanup-Image /RestoreHealth' to check system file integrity"
    ]
  },
  {
    "id": "antimalware-service-executable",
    "category": "Software",
    "difficulty": "Hard",
    "clues": [
      "The user's PC is extremely slow and unresponsive, especially during boot and file access.",
      "Task Manager shows 'Antimalware Service Executable' consuming 80-90% CPU and 2GB RAM constantly.",
      "The high usage persists even when the PC is completely idle.",
      "Disabling Windows Defender via Group Policy temporarily resolves the issue but it reverts on reboot.",
      "A third-party antivirus was previously installed and uninstalled, but Windows Defender did not fully re-enable its services."
    ],
    "answer": "stuck antimalware scan",
    "aliases": ["antimalware service executable high cpu", "msmpeng.exe high usage", "windows defender stuck", "defender high disk usage", "antivirus stuck scanning"],
    "explanation": "The Antimalware Service Executable (MsMpEng.exe) can get stuck in an infinite scan loop when it encounters a file it cannot fully read or when the scan state becomes orphaned. This commonly happens after a third-party AV leaves residual filter drivers that confuse Defender's real-time protection.",
    "fixSteps": [
      "Use the 'Remove-MpPreference -ExclusionPath' PowerShell command to clear any corrupted exclusion lists",
      "Run 'MpCmdRun.exe -Remediate -Scan' from an elevated command prompt in ProgramData\\Microsoft\\Windows Defender\\Platform\\[version]",
      "Use the Microsoft Safety Scanner tool for a full offline scan to reset Defender's internal scan state"
    ]
  },
  {
    "id": "com-surrogate-failure",
    "category": "Software",
    "difficulty": "Hard",
    "clues": [
      "User gets 'Microsoft (R) HTML Application Host has stopped working' error when opening certain folders in File Explorer.",
      "File Explorer crashes repeatedly when navigating to folders containing video or music files.",
      "The Event Viewer shows 'Faulting module name: WindowsCodecs.dll' under Application Error logs.",
      "Thumbnail previews in File Explorer show broken squares with 'X' marks instead of actual previews.",
      "Disabling thumbnail previews in File Explorer Options stops the crashes."
    ],
    "answer": "corrupted Windows imaging component",
    "aliases": ["com surrogate stopped working", "dllhost.exe crash", "file explorer crash thumbnail", "windows codecs failure", "thumbnail preview crash", "html application host crash"],
    "explanation": "File Explorer uses COM Surrogate processes (dllhost.exe) to render thumbnail previews for media files. When the Windows Codecs library (WindowsCodecs.dll) or the Media Foundation framework is corrupted, the surrogate process crashes, taking the thumbnail view down and potentially crashing Explorer.",
    "fixSteps": [
      "Run 'sfc /scannow' and 'DISM /Online /Cleanup-Image /RestoreHealth' to repair system image",
      "As a workaround, disable thumbnail previews in File Explorer Options > View > 'Always show icons, never thumbnails'",
      "If codec-specific, install the latest Media Feature Pack (especially on Windows N editions)"
    ]
  }
];

// Check for duplicates
const allIds = new Set();
const allAnswers = new Set();
let dupes = [];

for (const p of newPuzzles) {
  if (allIds.has(p.id)) dupes.push(`Duplicate ID: ${p.id}`);
  allIds.add(p.id);
  if (allAnswers.has(p.answer.toLowerCase())) dupes.push(`Duplicate answer: ${p.answer}`);
  allAnswers.add(p.answer.toLowerCase());
  if (existingIds.has(p.id)) dupes.push(`ID conflicts with existing: ${p.id}`);
  if (existingAnswers.has(p.answer.toLowerCase())) dupes.push(`Answer conflicts with existing: ${p.answer}`);
}

if (dupes.length > 0) {
  console.error('DUPLICATES FOUND:');
  dupes.forEach(d => console.error('  ', d));

  // Remove conflicting ones
  newPuzzles.forEach(p => {
    if (existingIds.has(p.id) || existingAnswers.has(p.answer.toLowerCase()) || allAnswers.has(p.answer.toLowerCase())) {
      // mark for removal
    }
  });
}

const combined = [...existing, ...newPuzzles];

// Tally by category and difficulty
const tally = {};
combined.forEach(p => {
  tally[p.category] = tally[p.category] || { Easy: 0, Medium: 0, Hard: 0, total: 0 };
  tally[p.category][p.difficulty]++;
  tally[p.category].total++;
});

console.log('TOTAL:', combined.length);
console.log('By category:');
Object.entries(tally).forEach(([cat, counts]) => {
  console.log(`  ${cat}: ${counts.total} (Easy: ${counts.Easy}, Medium: ${counts.Medium}, Hard: ${counts.Hard})`);
});

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'puzzles', 'index.json'), JSON.stringify(combined, null, 2));
console.log('\nWritten to src/data/puzzles/index.json');
