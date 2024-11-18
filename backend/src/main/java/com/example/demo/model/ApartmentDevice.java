package com.example.demo.model;

public class ApartmentDevice extends Device {

        private Apartment apartment;
        public ApartmentDevice(int id, String name, boolean consumesEnergy, EnergyCurve energyCurve, Apartment apartment) {
            super(id, name, consumesEnergy, energyCurve);
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
