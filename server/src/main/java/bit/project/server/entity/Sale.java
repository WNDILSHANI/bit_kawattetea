package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Sale{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private BigDecimal total;

    private BigDecimal discount;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Salestatus salestatus;

    @OneToMany(mappedBy="sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Saleinventory> saleinventoryList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "sale")
    private List<Customerpayment> saleCustomerpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "sale")
    private List<Customerrefund> saleCustomerrefundList;

    @JsonIgnore
    @OneToMany(mappedBy = "sale")
    private List<Distribution> saleDistributionList;


    public Sale(Integer id){
        this.id = id;
    }

    public Sale(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}