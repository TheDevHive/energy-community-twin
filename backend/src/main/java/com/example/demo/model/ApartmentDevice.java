package com.example.demo.model;

public class ApartmentDevice extends Device {

        private Apartment apartment;
        public ApartmentDevice(int id, String name, int consumesEnergy, EnergyCurve energyCurve, Apartment apartment, float windSensitivity, float lightSensitivity, float temperatureSensitivity, float precipitationSensitivity) {
            super(id, name, consumesEnergy, energyCurve, windSensitivity, lightSensitivity, temperatureSensitivity, precipitationSensitivity);
            this.apartment = apartment;
        }

        public Apartment getApartment() {
            return apartment;
        }

        public void setApartment(Apartment apartment) {
            this.apartment = apartment;
        }

        public String toString() {
            return "ApartmentDevice{" +
                    super.toString()+
                    "apartment=" + apartment +
                    '}';
        }
}
