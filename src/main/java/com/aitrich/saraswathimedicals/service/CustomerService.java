package com.aitrich.saraswathimedicals.service;

import com.aitrich.saraswathimedicals.domain.Customer;
import com.aitrich.saraswathimedicals.repository.CustomerRepository;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

/**
 * CustomerService
 */
@Service
@Transactional
public class CustomerService {

    CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
}
