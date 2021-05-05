package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Customerrefundproduct{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private BigDecimal refundprice;

    private Integer qty;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Customerrefund customerrefund;

    @ManyToOne
    private Product product;


    public Customerrefundproduct(Integer id){
        this.id = id;
    }

}