import streamlit as st

# -----------------------------
# Page Configuration
# -----------------------------
st.set_page_config(
    page_title="MetroFlow Analytics Dashboard",
    page_icon="🚇",
    layout="wide"
)

# -----------------------------
# Title
# -----------------------------
st.title("🚇 MetroFlow Analytics Dashboard")

st.markdown("""
### Infosys Springboard Internship Project

This dashboard summarizes the Exploratory Data Analysis (EDA)
performed on the Delhi Metro dataset.

It represents the analytical foundation for the MetroFlow
AI-based Crowd Management and Scheduling System.
""")

st.divider()

# -----------------------------
# KPI Section
# -----------------------------
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Trips", "150,000")

with col2:
    st.metric("Average Fare", "₹115.23")

with col3:
    st.metric("Average Distance", "6.42 km")

with col4:
    st.metric("Average Passengers", "20")

st.divider()

st.success("✅ MetroFlow EDA Pipeline Completed Successfully")