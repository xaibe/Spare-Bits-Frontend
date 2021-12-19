import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CategeoryService {
  Categeory = [
    { id: "1", name: "Electronic  Devices" },
    { id: "2", name: "Electronic Accessories" },
    { id: "3", name: "TV & Home Appliances" },
    { id: "4", name: "Mechanical Devices" },
    { id: "0", name: "Others" },
  ];

  subCategeory = [
    { id: "1", name: "Smart Phones" },
    { id: "1", name: "Tablets" },
    { id: "1", name: "Laptops" },
    { id: "1", name: "Desktops" },
    { id: "1", name: "Gaming Consoles" },
    { id: "1", name: "Cameras & Drones" },
    { id: "1", name: "Security Cameras" },
    { id: "1", name: "Others" },

    { id: "2", name: " Mobile Accessories" },
    { id: "2", name: "Headphones & Headsets" },
    { id: "2", name: "Bluetooth Headsets" },
    { id: "2", name: "Headphones & Headsets Access." },
    { id: "2", name: "In-Ear Headphones" },
    { id: "2", name: "Mono Headsets" },
    { id: "2", name: "Over-The-Ear Headphones" },
    { id: "2", name: "Wired Headsets" },
    { id: "2", name: "Camera Accessories" },
    { id: "2", name: "Computer Accessories" },
    { id: "2", name: "Storage" },
    { id: "2", name: "Printers" },
    { id: "2", name: "Computer Components" },
    { id: "2", name: "Network Components" },
    { id: "2", name: "Others" },

    { id: "3", name: "LED Televisions" },
    { id: "3", name: "Smart Televisions" },
    { id: "3", name: "TV Accessories" },
    { id: "3", name: "Home Audio & Theater" },
    { id: "3", name: "Kitchen Appliances" },
    { id: "3", name: "Cooling & Heating" },
    { id: "3", name: "Irons & Garment Care" },
    { id: "3", name: "Vacuums & Floor Care" },
    { id: "3", name: "Generator & Portable Power" },
    { id: "3", name: "Washers & Dryers" },
    { id: "3", name: "Others" },

    { id: "4", name: " Automotive" },
    { id: "4", name: "Motorcycle" },
    { id: "4", name: "Cars" },
    { id: "4", name: "Loaders & Rickshaw" },
    { id: "4", name: "Loaders" },
    { id: "4", name: "Auto Rikshaw" },
    { id: "4", name: "Bicycles" },
    { id: "4", name: "Others" },
  ];

  constructor() {}

  getCategeory() {
    return this.Categeory;
  }
  getsubCategeory() {
    return this.subCategeory;
  }
}
