#include <chrono>
#include <thread>
#include "TriageEngine.hpp"
#include <sstream>
#include <cstdlib>   // rand, srand
#include <ctime>

int main() {
    TriageEngine te;
    std::srand(static_cast<unsigned int>(std::time(nullptr))); // seed random number generator
    for (int i = 0; i < 15; ++i)
    {
        int NEWS2 = std::rand() % 21;   // 0..20
        int SI    = std::rand() % 5;    // 0..4
        int R     = std::rand() % 5;
        int A     = std::rand() % 2;
        std::stringstream ss; ss << "P" << std::setw(3) << std::setfill('0') << i;
        te.insert(ss.str(), NEWS2, SI, R, A);
    }

    std::cout << "=== Initial ===\n";
    te.dump();
    
    auto start = std::chrono::steady_clock::now();
    while (std::chrono::steady_clock::now() - start < std::chrono::milliseconds(5001)) { }    te.recomputeAll();
    std::cout << "\n=== After 5 sec ===\n";
    te.dump();

    while (std::chrono::steady_clock::now() - start < std::chrono::milliseconds(10002)) { }    te.recomputeAll();
    std::cout << "\n=== After 10 sec ===\n";
    te.dump();

    while (std::chrono::steady_clock::now() - start < std::chrono::milliseconds(15002)) { }    te.recomputeAll();
    std::cout << "\n=== After 15 sec ===\n";
    te.dump();
}