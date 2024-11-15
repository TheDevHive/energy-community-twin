package com.example.demo.model;

import java.util.Arrays;
import java.util.List;

public class EnergyCurve {
    private List<Integer> energyCurve;
    
    public EnergyCurve() {
        energyCurve = Arrays.asList(new Integer[]{50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50});
    }

    public EnergyCurve(List<Integer> energyCurve) {
        this.energyCurve = energyCurve;
        if(! validate()){
            throw new IllegalArgumentException("EnergyCurve is not valid");
        }
    }

    public List<Integer> getEnergyCurve() {
        return energyCurve;
    }

    public void setEnergyCurve(List<Integer> energyCurve) {
        this.energyCurve = energyCurve;
        if(! validate()){
            throw new IllegalArgumentException("EnergyCurve is not valid");
        }
    }

    public String toString() {
        return "EnergyCurve{" +
                "energyCurve=" + energyCurve +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        EnergyCurve energyCurve = (EnergyCurve) o;
        if (energyCurve != energyCurve.energyCurve)
            return false;
        return true;
    }
    
    public boolean validate(){
        return this.energyCurve != null && this.energyCurve.size() == 24;
    }
}