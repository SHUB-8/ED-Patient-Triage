#ifndef TRIAGE_ENGINE_HPP
#define TRIAGE_ENGINE_HPP

#include <queue>
#include <string>
#include <unordered_map>
#include <chrono>
#include <random>
#include <iomanip>
#include <iostream>
#include <bits/stdc++.h>

struct SectionCfg
{
    double wNEWS2 = 0.0, wSI = 0.0, wT = 0.0, wR = 0.0, wA = 0.0;
};

static const std::unordered_map<std::string, SectionCfg> Zones =
{
    {"RED_ZONE",    {0.40, 0.30, 0.00, 0.20, 0.10}},   // Immediate
    {"ORANGE_ZONE", {0.35, 0.25, 0.05, 0.25, 0.10}},   // Critical
    {"YELLOW_ZONE", {0.25, 0.20, 0.15, 0.30, 0.10}},   // Urgent
    {"GREEN_ZONE",  {0.10, 0.10, 0.30, 0.20, 0.30}},   // Semi-urgent
    {"BLUE_ZONE",   {0.05, 0.05, 0.40, 0.10, 0.40}}    // Low-care
};

// ---------- Patient ----------
struct Patient
{
    std::string pid;
    std::string section;
    int NEWS2, SI, R, A;
    std::chrono::steady_clock::time_point arrival;

    // cached priority (lower = higher priority)
    mutable double priority = 0.0;

    // compute priority based on current time
    void updatePriority(const SectionCfg& cfg,
                        std::chrono::steady_clock::time_point now) const {
        using namespace std::chrono;
        int T = std::min(4, static_cast<int>(duration_cast<seconds>(now - arrival).count()) / 5);
        priority =
            cfg.wNEWS2 * NEWS2 +
            cfg.wSI    * SI +
            cfg.wT     * T +
            cfg.wR     * R +
            cfg.wA     * A;
    }

    // comparator for max-heap
    bool operator<(const Patient& other) const {
        return priority < other.priority;
    }
};

// ---------- Triage Engine ----------
class TriageEngine
{
public:
    // returns the assigned section
    std::string insert(const std::string& pid,
                       int NEWS2, int SI, int R, int A) {
        std::string sec = assignSection(NEWS2, SI);
        Patient p{pid, sec, NEWS2, SI, R, A,
                  std::chrono::steady_clock::now()};
        p.updatePriority(Zones.at(sec), p.arrival);
        queues[sec].push(p);
        return sec;
    }

    void recomputeAll() {
        auto now = std::chrono::steady_clock::now();
        // ---- inside recomputeAll() ----
        for (auto it = queues.begin(); it != queues.end(); ++it) {
            const std::string& sec = it->first;
            auto& pq = it->second;
            if (pq.empty()) continue;

            std::priority_queue<Patient> newQ;
            while (!pq.empty()) {
                Patient p = pq.top(); pq.pop();
                p.updatePriority(Zones.at(sec), now);
                newQ.push(std::move(p));
            }
            pq.swap(newQ);
        }
    }

    void dump() const {
        // ---- inside dump() ----
        for (auto it = queues.begin(); it != queues.end(); ++it) {
            const std::string& sec = it->first;
            const auto& pq = it->second;            std::cout << "Section " << sec << " (" << pq.size() << ")\n";
            auto tmp = pq;
            while (!tmp.empty()) {
                const Patient& p = tmp.top();
                std::cout << "  " << p.pid
                          << " prio=" << std::fixed << std::setprecision(2)
                          << p.priority << '\n';
                tmp.pop();
            }
        }
    }

private:
    std::string assignSection(int NEWS2, int SI) {
        if (SI == 4 || NEWS2 >= 13) return "RED_ZONE";
        if (SI == 3 || NEWS2 >= 7)  return "ORANGE_ZONE";
        if (SI == 2 || NEWS2 >= 4)  return "YELLOW_ZONE";
        if (SI == 1 || NEWS2 >= 1)  return "GREEN_ZONE";
        return "BLUE_ZONE";
    }

    std::unordered_map<std::string, std::priority_queue<Patient>> queues;
};

#endif // TRIAGE_ENGINE_HPP